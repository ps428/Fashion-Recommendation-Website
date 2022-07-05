#Imports
from flask import Flask, request
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sqlalchemy import create_engine
from random import randint, randrange
 
# create sqlalchemy engine and connect to local database
#Caution: Do not keep special characters in password or db name 

engine = create_engine("mysql+pymysql://{user}:{pw}@localhost/{db}"
                       .format(user="nodejs",
                        pw="mysql",    #real password is span@123, but url encoded password is required
                        db="fashionDB"))

app = Flask(__name__)

def get_user_orders(user_id):
    #Fetch user orders data
    user_orders_query=f"""
    select o.order_id as OrderId,
           o.user_id as UserId,
           o.order_time_stamp as OrderTimeStamp,
           o.product_id as ProductId,
           o.quantity as Quantity,
           p.product as Product,
           p.product_price as ProductPrice,
           pcm.category_id as CategoryId,
           c.category as Category,
           pam.artist_id as ArtistId,
           a.artist as Artist,
           atm.theme_id as ThemeId,
           t.theme as Theme

    from orders o
    left join products p on p.product_id=o.product_id
    left join products_category_mapping pcm on pcm.product_id=p.product_id
    left join categories c on c.category_id=pcm.category_id
    left join products_artist_mapping pam on p.product_id=pam.product_id
    left join artists a on pam.artist_id=a.artist_id
    left join artists_theme_mapping atm on atm.artist_id=a.artist_id
    left join themes t on t.theme_id=atm.theme_id
    
    where
    o.user_id={user_id};
    """

    user_orders = pd.read_sql(
                        user_orders_query,
                        con=engine)

    if user_orders.empty:
        raise ValueError("Enter valid user_id")
    else:
        return user_orders

def get_user_pie_chart(user_id,attribute,output_folder_path):
    """
    Input : user_id (integer) 
            attribute (string) : one string out of 'Category','Artist','Theme'
            
    Output : pie chart of this user_id corresponding to attribute showing preference of this
             user_id towards each value of this attribute based on past orders.
    """
    
    user_orders=get_user_orders(user_id)
    user_attribute_df=user_orders.groupby([attribute]).agg({'Quantity':sum})
    #display(user_attribute_df)
    attribute_values=list(user_attribute_df.index)

    quantities=[]

    for attr_val in (attribute_values):
        quantity=user_attribute_df.loc[attr_val]['Quantity']   
        quantities.append(quantity)
        
    # Creating plot
    #plt.figure(figsize =(10, 7))
    plt.figure(figsize =(8, 3))
    #plt.pie(quantities, labels = attribute_values,rotatelabels=True, autopct='%.1f%%')
    plt.pie(quantities,rotatelabels=True, autopct='%.1f%%')

    # show plot
    #plt.legend(loc="best")
    plt.legend(quantities,labels = attribute_values,loc="best")
    plt.axis('equal')
    if attribute=='Artist':
        plt.title(f'Past preference for Fictional Character/Movies',fontsize = 12,fontweight='bold',fontname='Times New Roman',y=-0.1)
    else:
        plt.title(f'Past preference for {attribute}',fontsize = 12,fontweight='bold',fontname='Times New Roman',y=-0.1)
    filepath=f"{output_folder_path}/{attribute}_pie_{randint(1, 999)}.png"
    plt.savefig(filepath,bbox_inches='tight')

    return filepath

#@app.route('/personalization/',methods=['GET', 'POST'])
def get_data():
    user_id=5
    #attributes=['Category','Artist','Theme']
    attributes=['Category','Artist']
    response_dict={}
    for attr in attributes:
        output_filepath=get_user_pie_chart(user_id=user_id,attribute=attr,output_folder_path='/home/spanidea-168/Documents/SpanIdea_Office_work/Fashion_recommendation_prototype/results')
        response_dict[attr]=output_filepath

    return response_dict

# def get_all_charts(user_id):
#     #attributes=['Category','Artist','Theme']
#     attributes=['Category','Artist']
#     #attribute=json_dict['attribute']
#     response_dict={}
#     for idx, attr in enumerate(attributes):
#         output_filepath=get_user_pie_chart(user_id=user_id,attribute=attr,output_folder_path='/home/spanidea-168/Documents/SpanIdea_Office_work/Fashion_recommendation_prototype/results')
#         response_dict[f"image_{idx+1}"]=output_filepath

#     return response_dict

# @app.route('/personalization', methods=['POST'])
# def process_json():
#     content_type = request.headers.get('Content-Type')
#     if (content_type == 'application/json'):
#         json_dict = request.json
#         print(json_dict)
#         print(type(json_dict))
#         print(json_dict['user_id'],type(json_dict['user_id']))
#         user_id=int(json_dict['user_id'])
#         response_dict=get_all_charts(user_id)
#         #output_filepath=get_user_pie_chart(user_id=user_id,attribute=attribute,output_folder_path='/home/spanidea-168/Documents/SpanIdea_Office_work/Fashion_recommendation_prototype/results')
#         return response_dict
#     else:
#         return 'Content-Type not supported!'

def get_userid(username):
    query=f"""
            select user_id from users
            where username='{username}';
            """
    connection = engine.connect()
    result=connection.execute(query)
    user_id=result.fetchall()[0][0]
    return user_id

def get_all_charts(user_id):
    attributes=['Category','Artist']
    response_dict={}
    for idx, attr in enumerate(attributes):
        output_filepath=get_user_pie_chart(user_id=user_id,attribute=attr,output_folder_path='/home/spanidea-168/Documents/SpanIdea_Office_work/Fashion_recommendation_prototype/results')
        response_dict[f"image_{idx+1}"]=output_filepath

    return response_dict

def get_user_pie_data(user_id,attribute):
    """
    Input : user_id (integer) 
            attribute (string) : one string out of 'Category','Artist','Theme'
            
    Output : dictionary for user_id corresponding to attribute where keys are attribute_name and values are quantity of products
            purchased by it corresponding to this attribute_name.
    """
    
    user_orders=get_user_orders(user_id)
    user_attribute_df=user_orders.groupby([attribute]).agg({'Quantity':sum})
    #display(user_attribute_df)
    attribute_values=list(user_attribute_df.index)

    quantity_dict={}

    for attr_val in (attribute_values):
        quantity=user_attribute_df.loc[attr_val]['Quantity']   
        quantity_dict[attr_val]=str(quantity)

    return quantity_dict

def get_piecharts_data(user_id):
    attributes=['Category','Artist']
    response_dict={}
    for idx, attr in enumerate(attributes):
        response_dict[attr]=get_user_pie_data(user_id,attr)

    return response_dict