Micro!

A multi-panel tool for identifying possible interactions between micro RNA (miRNA data) and Proteins (RPPA data), 
in the absence of gene expression (mRNA data) interaction in TCGA data.  

For a particular TCGA tumor dataset (e.g. glioblastoma multiforme, or GBM), the molecular data across all samples (or within clusters based on subtype, phenotype, survival, etc) is
analyzed to compute correlations between all pairs of features.  This result is then filtered to the list of feature pairs described below.

The main 2d scatterplot shows the correlation between miRNA, data and other datatypes.

The molecular features consists of:
Proteins and microRNA that are capable of interaction (as annotated in ???).  Protein phospho-antibodies have been removed from the list.
Genes (mRNA) that produce the above proteins after transcription.

X-axis shows 2 possible datasets:
1. The correlation between miRNA and RPPA for pairs that are known to interact.  

2. The correlation between miRNA and the gene expression (mRNA) features that transcribe the proteins known to interact with the miRNA.

Y-axis: The correlations between proteins (RPPA) and the genes expression (mRNA) that transcribe those proteins for pairs that are known to interact (as annotated in ???).



This tool was created as a part of the Center for Systems Analysis of the Cancer Regulome under The Cancer Genome Atlas
with funding from NCI and NHGRI.
