#Imports
from flask import Flask, request
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import json
from sqlalchemy import create_engine
from apis.fetch_visualize_user_data import get_user_orders
# create sqlalchemy engine and connect to local database
#Caution: Do not keep special characters in password or db name 

engine = create_engine("mysql+pymysql://{user}:{pw}@localhost/{db}"
                       .format(user="nodejs",
                        pw="mysql",    #real password is span@123, but url encoded password is required
                        db="fashionDB"))

#app = Flask(__name__)

def get_user_ids():
    user_query=f"""
                select user_id from users;
               """
    user_id_array = pd.read_sql(
                        user_query,
                        con=engine)
    if user_id_array.empty:
        raise ValueError("Some error")
    else:
        print(user_id_array)
        return user_id_array


def get_user_scores_with_products(user_id):
    user_query=f"""
                select * from user_product_interact_score where user_id={user_id};
               """
    
    user_rec_df = pd.read_sql(
                        user_query,
                        con=engine)
    if user_rec_df.empty:
        raise ValueError("Enter valid user_id")
    else:
        return user_rec_df

def get_top_N_prod_ids(user_id,N):
    user_rec_df=get_user_scores_with_products(user_id)
    user_rec_df.drop(['user_id'], axis = 1,inplace=True)
    sorted_df=user_rec_df.sort_values(by =0, ascending = 0, axis=1)
    top_N_products=sorted_df.columns.tolist()[:N]
    return top_N_products

def fetch_products(prod_ids_list):
    product_string='('
    for idx, prod_id in enumerate(prod_ids_list):
        if idx<len(prod_ids_list)-1:
            product_string+=f"{prod_id},"
        else:
            product_string+=f"{prod_id})"
            
    prod_detail_query=f"""
                    select * from products_detail 
                    where product_id in {product_string}
                """
    prod_detail_df = pd.read_sql(
                            prod_detail_query,
                            con=engine)
    
    return prod_detail_df

def fetch_products_in_given_order(prod_ids_list):
    product_string='('
    for idx, prod_id in enumerate(prod_ids_list):
        if idx<len(prod_ids_list)-1:
            product_string+=f"{prod_id},"
        else:
            product_string+=f"{prod_id})"
           
    order_by_clause=""
    for idx, prod_id in enumerate(prod_ids_list):
        order_by_clause+=f"when {prod_id} then {idx+1}\n "
        
    prod_img_query=f"""select * from products_detail 
                        where product_id in {product_string}
                        order by (case products_detail.product_id \n
                                         {order_by_clause}
                                         end);
                    """
    print(prod_img_query)
    prod_img_df = pd.read_sql(
                            prod_img_query,
                            con=engine)
    
    return prod_img_df

def df_to_dict(df,index_column):
    products_dict={}
    for i in df.index:
        result_dict={}
        detail_dict={}
        for col in df.columns:
            if col!=index_column:
                detail_dict[col]=df.iloc[i][col]
            
        result_dict[index_column]=int(df.iloc[i][index_column])
        result_dict['detail']=detail_dict
        products_dict[f"product_{i+1}"]=result_dict
    return products_dict   

def df_to_array(df):
    products_array=[]
    for i in df.index:
        detail_dict={}
        for col in df.columns:
            try:
                detail_dict[col]=int(df.iloc[i][col])
            except:
                detail_dict[col]=df.iloc[i][col]
            
        products_array.append(detail_dict)
    return json.dumps(products_array)  

def get_user_recommendations(user_id):
    N=5
    top_prod_ids=get_top_N_prod_ids(user_id,N)
    #prod_detail_df=fetch_products(top_prod_ids)
    prod_detail_df=fetch_products_in_given_order(top_prod_ids)
    prod_detail_array=df_to_array(prod_detail_df)
    return prod_detail_array

def fetch_user_purchased_products(user_id):
    user_orders=get_user_orders(user_id)
    user_orders=user_orders[['ProductId','Quantity']]
    prod_lists=user_orders['ProductId'].unique().tolist()
    user_orders.rename(columns={'ProductId':'product_id','Quantity':'quantity'},inplace=True)
    products_df=fetch_products(prod_lists)
    purchased_products_detail_df=pd.merge(user_orders,products_df,how='left',on=['product_id'])
    purchased_products_detail=df_to_array(purchased_products_detail_df)
    return purchased_products_detail