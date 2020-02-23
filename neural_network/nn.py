import tensorflow as tf
import pandas as pd
import io
import keras
from sklearn.model_selection import train_test_split

df = pd.read_csv("data.csv")
print(df.head(6))

X = df.iloc[:, 1:6].values
Y = df.iloc[:, 7].values
X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.2)

print(X_train.shape, X_test.shape, Y_train.shape, Y_test.shape)

