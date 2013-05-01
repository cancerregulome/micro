# get list of RPPA labels for a dataset
#retrieve RPPA pairwise where other data type is GEXP or MIRN
#cut the interaction list to just the observed RPPA labels
#cut the retrieved query to valid interactions (remove )

# intersect GEXP <-> RPPA and MIRN <-> RPPA for exact RPPA matches

import sys
import json
import os
import argparse

interaction_filename = "human_interactions.predicted.v2.all3db.table"


def load_mirn_gene_interactions(filename):

    try:
        f = open(filename,'r')
        interactions = {}
        for line in f:
            interaction = line.split('\t')[0].split(':')  # [mirna, gene]
            if (interaction[1] in interactions):
                interactions[interaction[1]] = interactions[interaction[1]] + [interaction[0]]  # hash[gene] = mirna
            else:
                interactions[interaction[1]] = [interaction[0]]
    except IOError as e:
        print "Error %d: %s" % (e.args[0], e.args[1])
    
    finally:
        f.close()

    return interactions

def resolve_dataset_path(input_files_string):
    import re
    files = input_files_string.replace("{","").replace("}","") #strip brackets out
    fields = files.split(",")
    for field in fields:
        elements = field.split(":")
        if (elements[0] == "associations"):
            return elements[1]
    return ""


def parse_feature(alias):
    tokens = alias.split(':')
    if (tokens[1] == "RPPA"):
        return [tokens[1], tokens[2] + ':' + tokens[-1]]
    return tokens[1:3]

def rectify_json(json_array):
    final_list = []
    for pair in json_array:     
        final_list.append(parse_json(pair))
    return final_list

def rectify_tsv(json_array):
    final_list = []
    for pair in json_array:     # pair = alias1 \t alias2 \t correlation \t num_non_NA \t -log10_pvalue \t ???
        final_list.append(parse_tab_delimited(pair))
    return final_list    

def parse_json(pair): # line = {"alias1": "xxx" , "alias2": "xxx", "correlation": #.#}       
    item = []
    f1 = parse_feature(pair["alias1"])
    f2 = parse_feature(pair["alias2"])
    item = [ f1[1], f2[1], pair["correlation"] ]
    if ("RPPA" == f2[0] ):
        item[0], item[1] = item[1], item[0]  #make RPPA label the 1st element
    return item

def parse_tab_delimited(line):
    item = []
    tokens = line.split("\t")
    f1 = parse_feature(tokens[0])
    f2 = parse_feature(tokens[1])
    item = [ f1[1], f2[1], float(tokens[2])]
    if ("RPPA" == f2[0] ):
        item[0], item[1] = item[1], item[0]  #make RPPA label the 1st element       
    return item

def filter_pairwise_results(in_file, mirna_out_file, gexp_out_file):
    f = open(in_file,'r')
    mirna_out = open(mirna_out_file, 'w')
    gexp_out = open(gexp_out_file, 'w')

    fields = []

    for line in f:
        if (":RPPA:" in line):
            if (":MIRN:" in line):
                mirna_out.write(line)
            elif (":GEXP:" in line):
                fields = line.split('\t')
                label0 = fields[0].split(":")[2]
                label1 = fields[1].split(":")[2]
                if (label0 == label1):
                    gexp_out.write(line)
    f.close()
    mirna_out.close()
    gexp_out.close()

def load_triplets(in_file):
    f = open(in_file, 'r')
    triplets = []
    for pair in f:     # pair = alias1 \t alias2 \t correlation \t num_non_NA \t -log10_pvalue \t ???
        triplets.append(parse_tab_delimited(pair))
    return triplets   

def intersect_labels(mirna_replies, gexp_replies, known_interactions):
    intersection = {}
    final_list = []
    for reply in mirna_replies: #reply = [RPPA,MIRN,correlation]
        rppa_label = reply[0].split(":")[0]
        if (rppa_label in known_interactions and reply[1].lower() in known_interactions[rppa_label]):  #if mirna interaction is known to occur
            reply[1] = reply[1].lower() #microRNA should be lowercase
            if (reply[0] in intersection):  #already stored the protein in the key store
                intersection[reply[0]] = intersection[reply[0]] + [reply]              #append microrna triplet
            else:
                intersection[reply[0]] = [reply]    #initialize with microrna triplet
    for reply in gexp_replies:   #reply = [RPPA,GEXP,correlation]
        if (reply[0] in intersection):      #if the gene label has already been added (mirn -> rppa pairwise)
            mirna = intersection[reply[0]]  #grab the mirna triplet array
            for mirna_entry in mirna:
                final_list.append({"RPPA" : reply[0], 
                                    "GEXP" : reply[1],
                                    "MIRN" : mirna_entry[1],
                                    "gexp_corr" : reply[2],
                                    "mirn_corr" : mirna_entry[2],
                                    "id" : reply[1] + "+" + reply[0] + "+" + mirna_entry[1]
                                    })

    return final_list

def main():
    mirna_temp = 'mirna_temp.out'
    gexp_temp = 'gexp_temp.out'

    interactions = load_mirn_gene_interactions(interaction_filename)

    datasets = [["gbm-pub2013","gbm.xyz.pwpv"]]

    for dataset in datasets:
        # dataset_file = resolve_dataset_path(dataset[1])
        dataset_file = dataset[1]
        if (not os.path.isfile(dataset_file)):
            print "Dataset file not found: ", dataset_file
            continue
        
        filter_pairwise_results(dataset_file, mirna_temp, gexp_temp )
        mirna_replies = load_triplets(mirna_temp)
        gexp_replies = load_triplets(gexp_temp)
        final_data = intersect_labels(mirna_replies,gexp_replies, interactions)
        
        f = open(dataset[0]+".json",'w')
        json.dump(final_data,f)
        f.close()


if __name__ == '__main__':
    main()

