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

#app = Flask(__name__)

def fetch_product_orders(prod_id):
    orders_query=f"""
    select order_id,
           order_time_stamp,
           product_id,
           quantity
    
    from orders
    where product_id={prod_id};
    """

    Orders_data = pd.read_sql(
                        orders_query,
                        con=engine)

    return Orders_data

def get_trend(prod_id,output_folder_path,months,years):
    orders_df=fetch_product_orders(prod_id)
    # Using pandas.to_datetime() to convert pandas column to DateTime
    orders_df['order_time_stamp'] = pd.to_datetime(orders_df['order_time_stamp'], format="%Y-%m-%d %H:%M:%S")
    # applying the groupby function on df
    per_month_data=orders_df[['order_time_stamp','quantity']].groupby(pd.Grouper(key='order_time_stamp', axis=0, 
                          freq='M')).sum()
    per_month_data.reset_index(inplace=True)
    per_month_data['month'] = per_month_data['order_time_stamp'].dt.month
    per_month_data['year'] = per_month_data['order_time_stamp'].dt.year
    per_month_data=per_month_data[['year','month','quantity']]

    
    trend_df=pd.DataFrame(columns=['year','month'])
    for year in years:
        for month in months:
                trend_df.loc[len(trend_df.index)] =[year,month] 
            
    trend_df=pd.merge(trend_df,per_month_data,on=['year','month'],how='left')
    trend_df[['quantity']] = trend_df[['quantity']].fillna(0)

    month_names=['Jan','Feb','March','April','May','June','July','Aug','Sep','Oct','Nov','Dec']
    month_year=[]
    for i in trend_df.index:
        month=month_names[int(trend_df.iloc[i]['month'])-1]
        year=int(trend_df.iloc[i]['year'])
        month_year.append(month+'-'+str(year))

    plt.bar(month_year, trend_df['quantity'])
    plt.xticks(month_year,rotation='45')
    plt.ylabel('Quantity sold')
    plt.title(f'Half-yearly Trend of product id={prod_id}',y=-0.35)
    #plt.show()
    filepath=f"{output_folder_path}/trend_id_{prod_id}_{randint(1, 999)}.png"
    plt.savefig(filepath,bbox_inches='tight')
    return filepath

def get_product_trend(prod_id,months,years):
    orders_df=fetch_product_orders(prod_id)
    # Using pandas.to_datetime() to convert pandas column to DateTime
    orders_df['order_time_stamp'] = pd.to_datetime(orders_df['order_time_stamp'], format="%Y-%m-%d %H:%M:%S")
    # applying the groupby function on df
    per_month_data=orders_df[['order_time_stamp','quantity']].groupby(pd.Grouper(key='order_time_stamp', axis=0, 
                          freq='M')).sum()
    per_month_data.reset_index(inplace=True)
    per_month_data['month'] = per_month_data['order_time_stamp'].dt.month
    per_month_data['year'] = per_month_data['order_time_stamp'].dt.year
    per_month_data=per_month_data[['year','month','quantity']]

    
    trend_df=pd.DataFrame(columns=['year','month'])
    for year in years:
        for month in months:
                trend_df.loc[len(trend_df.index)] =[year,month] 
            
    trend_df=pd.merge(trend_df,per_month_data,on=['year','month'],how='left')
    trend_df[['quantity']] = trend_df[['quantity']].fillna(0)

    month_names=['Jan','Feb','March','April','May','June','July','Aug','Sep','Oct','Nov','Dec']
    #month_year=[]
    month_quant_dict={}
    for i in trend_df.index:
        month=month_names[int(trend_df.iloc[i]['month'])-1]
        year=int(trend_df.iloc[i]['year'])
        #month_year.append(month+'-'+str(year))
        m_y=month+'-'+str(year)
        month_quant_dict[m_y]=str(trend_df.iloc[i]['quantity'])
    
    return month_quant_dict