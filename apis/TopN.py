#Imports
from flask import Flask, request
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import json
from sqlalchemy import create_engine
#from apis.fetch_user_recommendations import fetch_products
# create sqlalchemy engine and connect to local database
#Caution: Do not keep special characters in password or db name 

engine = create_engine("mysql+pymysql://{user}:{pw}@localhost/{db}"
                       .format(user="root",
                        pw="span%40123",    #real password is span@123, but url encoded password is required
                        db="Fashion_db"))

app = Flask(__name__)

# def get_topN_products(N):
#     topN_products_query=f"""
#                         SELECT product_id, 
#                                SUM(quantity) as total_quantity
#                         FROM orders 
#                         GROUP BY product_id
#                         ORDER BY total_quantity desc
#                         LIMIT {N};
#                     """
#     topN_prod_df = pd.read_sql(
#                             topN_products_query,
#                             con=engine)
#     topN_prod_ids=topN_prod_df['product_id'].to_list()
#     prod_detail_df=fetch_products(topN_prod_ids)
#     prod_detail_array=df_to_array(prod_detail_df)
#     return prod_detail_array

def get_topN_products(N):
    topN_products_query=f"""
                        SELECT product_id, 
                               SUM(quantity) as total_quantity
                        FROM orders 
                        GROUP BY product_id
                        ORDER BY total_quantity desc
                        LIMIT {N};
                    """
    topN_prod_df = pd.read_sql(
                            topN_products_query,
                            con=engine)
    topN_prod_ids=topN_prod_df['product_id'].to_list()
    prod_detail_df=fetch_products(topN_prod_ids)
    prod_detail_df=pd.merge(topN_prod_df,prod_detail_df,how='left',on=['product_id'])
    prod_detail_array=df_to_array(prod_detail_df)
    return prod_detail_array

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

def fetch_orders():
    orders_query="""
    select o.order_id,
           o.user_id,
           o.order_time_stamp,
           o.product_id,
           o.quantity,
           p.product,
           p.product_price,
           pcm.category_id,
           c.category,
           pam.artist_id,
           a.artist,
           atm.theme_id,
           t.theme

    from orders o
    left join products p on p.product_id=o.product_id
    left join products_category_mapping pcm on pcm.product_id=p.product_id
    left join categories c on c.category_id=pcm.category_id
    left join products_artist_mapping pam on p.product_id=pam.product_id
    left join artists a on pam.artist_id=a.artist_id
    left join artists_theme_mapping atm on atm.artist_id=a.artist_id
    left join themes t on t.theme_id=atm.theme_id;
    """

    Orders_data = pd.read_sql(
                        orders_query,
                        con=engine)

    return Orders_data

def get_topN_categories(Orders_data,N):
    grouped_category_df = Orders_data[['category_id','category','quantity']].groupby(["category_id","category"])
    category_quantity_df = grouped_category_df["quantity"].sum().to_frame(name='total_quantity')
    category_quantity_df.sort_values(by='total_quantity', ascending=False,inplace=True)
    category_quantity_df=category_quantity_df.reset_index()
    category_quantity_df=category_quantity_df[:N]
    category_detail_array=df_to_array(category_quantity_df)
    return category_detail_array

def get_topN_artists(Orders_data,N):
    grouped_artist_df = Orders_data[['artist_id','artist','quantity']].groupby(["artist_id","artist"])
    artist_quantity_df = grouped_artist_df["quantity"].sum().to_frame(name='total_quantity')
    artist_quantity_df.sort_values(by='total_quantity', ascending=False,inplace=True)
    artist_quantity_df=artist_quantity_df.reset_index()
    artist_quantity_df=artist_quantity_df[:N]
    artist_detail_array=df_to_array(artist_quantity_df)
    return artist_detail_array

def get_topN_themes(Orders_data,N):
    grouped_themes_df = Orders_data[['theme_id','theme','quantity']].groupby(["theme_id","theme"])
    theme_quantity_df = grouped_themes_df["quantity"].sum().to_frame(name='total_quantity')
    theme_quantity_df.sort_values(by='total_quantity', ascending=False,inplace=True)
    theme_quantity_df=theme_quantity_df.reset_index()
    theme_quantity_df=theme_quantity_df[:N]
    theme_detail_array=df_to_array(theme_quantity_df)
    return theme_detail_array

def df_to_array(df):
    result_array=[]
    for i in df.index:
        detail_dict={}
        for col in df.columns:
            try:
                detail_dict[col]=int(df.iloc[i][col])
            except:
                detail_dict[col]=df.iloc[i][col]
            
        result_array.append(detail_dict)
    return json.dumps(result_array)  

def get_topN_attributes(N):
    Orders_data=fetch_orders()
    category_array=get_topN_categories(Orders_data,N)
    artist_array=get_topN_artists(Orders_data,N)
    themes_array=get_topN_themes(Orders_data,N)
    return category_array,artist_array,themes_array