#Imports
from flask import Flask, request
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import json
from sqlalchemy import create_engine
import matplotlib.pyplot as plt
from random import randint

engine = create_engine("mysql+pymysql://{user}:{pw}@localhost/{db}"
                       .format(user="nodejs",
                        pw="mysql",    #real password is span@123, but url encoded password is required
                        db="fashionDB"))

def get_product_names():
    products_query=f"""
        select Concat(category, ',',artist, ',',theme) as product_name, product_id 
        from 
        products_detail;
    """

    products_data = pd.read_sql(
                        products_query,
                        con=engine)

    # print(products_data)
    json_products_array = products_data.to_json(orient ='split')
    # print((json_products_array))
    return json_products_array


def get_product_trend_df(product_id,month_names):
    product_trend_query=f"""
                    select EXTRACT(month FROM  o.order_time_stamp) as month,
                           EXTRACT(year FROM  o.order_time_stamp) as year,
                           sum(o.quantity) as quantity
                        
                    from orders o
                    where o.product_id={product_id}
                    GROUP BY month ,year
                    ORDER BY month, year;
                 """

    product_trend_df = pd.read_sql(
                        product_trend_query,
                        con=engine)

    product_trend_df=get_trend_df(product_trend_df,month_names)
    return product_trend_df

def get_product_trend(product_id):
    month_names=['Jan','Feb','March','April','May','June' ]#,'July','Aug','Sep','Oct','Nov','Dec']
    product_trend_df=get_product_trend_df(product_id,month_names)

    temp_dict=dict(zip(product_trend_df.month_year, product_trend_df.quantity))
    return temp_dict

def get_category_trend_df(category,month_names):
    category_trend_query=f"""
                    select EXTRACT(month FROM  o.order_time_stamp) as month,
                           EXTRACT(year FROM  o.order_time_stamp) as year,
                           sum(o.quantity) as quantity
                        
                    from orders o
                           left join products_category_mapping pcm on o.product_id=pcm.product_id
                           left join categories c on pcm.category_id=c.category_id
                    where c.category='{category}'
                    GROUP BY month ,year
                    ORDER BY month, year;
                 """

    category_trend_df = pd.read_sql(
                        category_trend_query,
                        con=engine)

    
    #category_trend_df.drop(category_trend_df.index[category_trend_df['month'] == 2], axis=0,inplace=True)
    category_trend_df=get_trend_df(category_trend_df,month_names)
    return category_trend_df

def get_trend_df(df,month_names):
    for year in df.year.unique():
        for idx in range(len(month_names)):
            if df.loc[df["month"] == idx+1].empty == False:
                df.loc[df["month"] == idx+1, "month_name"] = month_names[idx]
            else:
                new_row_df=pd.DataFrame({'month': idx+1,'month_name':[month_names[idx]], 'year':[year], 'quantity':[0]})
                df=pd.concat([df,new_row_df])

    df.sort_values(by = ['year','month'], ascending = [True, True],inplace=True)
    df['year']=df['year'].astype(str)
    df['month_year'] = df[['month_name', 'year']].apply(lambda x: '-'.join(x), axis = 1)
    df.drop(['month','year','month_name'], axis=1,inplace=True)
    #print(df)
    return df

def get_category_trend(category):
    month_names=['Jan','Feb','March','April','May','June']#'July','Aug','Sep','Oct','Nov','Dec']
    category_trend_df=get_category_trend_df(category,month_names)

    temp_dict=dict(zip(category_trend_df.month_year, category_trend_df.quantity))
    return temp_dict

def get_artist_trend_df(artist,month_names):
    artist_trend_query=f"""
                    select EXTRACT(month FROM  o.order_time_stamp) as month,
                           EXTRACT(year FROM  o.order_time_stamp) as year,
                           sum(o.quantity) as quantity
                        
                    from orders o
                           left join products_artist_mapping pam on o.product_id=pam.product_id
                           left join artists a on pam.artist_id=a.artist_id
                    where a.artist='{artist}'
                    GROUP BY month ,year
                    ORDER BY month, year;
                 """

    artist_trend_df = pd.read_sql(
                        artist_trend_query,
                        con=engine)

    # artist_trend_df.drop(artist_trend_df.index[artist_trend_df['month'] == 2], axis=0,inplace=True)
    # print(artist_trend_df)
    artist_trend_df=get_trend_df(artist_trend_df,month_names)
    return artist_trend_df

def get_artist_trend(artist):
    month_names=['Jan','Feb','March','April','May','June']#,'July','Aug','Sep','Oct','Nov','Dec']
    artist_trend_df=get_artist_trend_df(artist,month_names)

    temp_dict=dict(zip(artist_trend_df.month_year, artist_trend_df.quantity))
    return temp_dict

# print(get_category_trend('Joggers'))
# print(get_artist_trend('Looney Tunes'))
#print(get_product_trend(1))