import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Qt5Agg")
import matplotlib.pyplot as plt
from pandas.plotting import scatter_matrix

pd_df = pd.read_csv("data_og.csv")
print(pd_df.head())

pd_df.describe().to_csv("describe_og.csv")
pd_df[['Happy','Angry','Disgusted']].corr().to_csv("correlation_og.csv")

columns = ['Happy','Angry','Disgusted']
x_data = range(0, pd_df.shape[0])
fig, ax = plt.subplots()
for column in columns:
    ax.plot(x_data, pd_df[column], label=column)
ax.set_title('Happy v/s Angry v/s Disgusted')
ax.legend()
plt.savefig('Emotions_Line_OG.png')

pd_df_sub = pd_df[['Happy','Angry','Disgusted']]
scatter_matrix(pd_df_sub, alpha=0.2)
plt.savefig('Emotions_Scatter_OG.png')