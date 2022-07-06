#Imports
from flask import Flask, request
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import json
from sqlalchemy import create_engine
from apis.fetch_visualize_user_data import get_all_charts, get_userid, get_piecharts_data
from apis.fetch_user_recommendations import get_user_recommendations, fetch_user_purchased_products, get_usernames
from apis.TopN import get_topN_products,get_topN_attributes
from apis.product_trend import get_trend, get_product_trend, get_product_names
from flask_cors import CORS, cross_origin

# create sqlalchemy engine and connect to local database
#Caution: Do not keep special characters in password or db name 

engine = create_engine("mysql+pymysql://{user}:{pw}@localhost/{db}"
                       .format(user="nodejs",
                        pw="mysql",    #real password is span@123, but url encoded password is required
                        db="fashionDB"))

app = Flask(__name__)
CORS(app)


@app.route('/personalization', methods=['POST'])
def user_personalization():
    """
    request_format:
    {
        "func": string   #(one of 'get_all_charts' or 'get_user_recommendations')
        "user_id" : int  #(currently 1,2,..,30 is valid range)
    }

    response:
    if "func" == "get_all_charts"
    response = {
                "func": "get_all_charts",
                "data": {
                        "image_1": image path,
                        "image_2": image path,
                        "image_3": image path
                        }
                }
    if "func" == "get_user_recommendations\"
    response = {
                "func": "get_user_recommendations\",
                "data": [{
                                "product_id": int,
                                "category": string,
                                "artist": string,
                                "theme": string,
                                "img_path": string (image path )
                         },
                         {
                                "product_id": int,
                                "category": string,
                                "artist": string,
                                "theme": string,
                                "img_path": string (image path )
                         },
                         so on... upto 5 products
                        ]
    """
    content_type = request.headers.get('Content-Type')
    if (content_type == 'application/json'):
        json_dict = request.json
        print(json_dict)
        functionality=json_dict['func']
        #user_id=int(json_dict['user_id'])
        username=json_dict['username']
        user_id=get_userid(username)
        #if functionality=='get_all_charts':  
        if functionality=='get_piecharts_data': 
            #response_dict={'func':'get_all_charts'}
            #response_dict['data']=get_all_charts(user_id)
            #response=get_all_charts(user_id)
            response=get_piecharts_data(user_id)
            #return json.dumps(response_dict)
            return json.dumps(response)
        elif functionality=='get_user_recommendations':
            #response_dict={'func':'get_user_recommendations'}
            #response_dict['data']=get_user_recommendations(user_id)
            response=get_user_recommendations(user_id)
            #return json.dumps(response_dict)
            return json.dumps(response)
            #return json_dict
        elif functionality=='get_user_products':
            response=fetch_user_purchased_products(user_id)
            return json.dumps(response)
        elif functionality=='get_usernames':
            print("getting all usernames")
            response=get_usernames()
            print(type(response))
            return json.dumps(response)
        else:
            return 'Invalid request!'

    else:
        return 'Content-Type not supported!'

# @app.route('/trending', methods=['POST'])
# def website_trend():
#     """
#     request format:
#     {
#         "func":"get_topN_products" or get_topN_attributes
#     }

#     response format:
#     for func="get_topN_products"
#     [{
#         "product_id": int,
#         "category": string,
#         "artist": string,
#         "theme": string,
#         "img_path": string (image path )
#      },
#      {
#         "product_id": int,
#         "category": string,
#         "artist": string,
#         "theme": string,
#         "img_path": string (image path )
#      },
#         so on... upto 5 products
#     ]

#     for func="get_topN_attributes"
#     {
#     "category": [
#                     {
#                         "category_id": int,
#                         "category": string,
#                         "total_quantity": int
#                     },
#                     and so on...
#                 ]
#                     ,
#     "artist":   [
#                     {
#                         "artist_id": int,
#                         "artist": string,
#                         "total_quantity": int
#                     },
#                     and so on...
#                 ],
#     "theme":    [
#                     {
#                         "theme_id": int,
#                         "theme": string,
#                         "total_quantity": int
#                     },
#                     and so on...
#                 ]
#     }

#     """
#     content_type = request.headers.get('Content-Type')
#     if (content_type == 'application/json'):
#         json_dict = request.json
#         functionality=json_dict['func']
#         #user_id=int(json_dict['user_id'])

#         if functionality=='get_topN_products':  
#             #response_dict={'title':'Top Products'}
#             #response_dict['data']=get_topN_products(N=5)
#             response=get_topN_products(N=5)
#             #return json.dumps(response_dict)
#             return json.dumps(response)

#         elif functionality=='get_topN_attributes':
#             #response_dict={'func':'get_topN_attributes'}
#             category_array,artist_array,themes_array=get_topN_attributes(N=3)
#             # data_dict={
#             #     "category":{"title":"Top Categories","data":category_array},
#             #     "artist":{"title":"Top Artists","data":artist_array},
#             #     "theme": {"title":"Top Artists","data":themes_array}
#             # }
#             data_dict={
#                 "category":category_array,
#                 "artist":artist_array,
#                 "theme":themes_array
#             }
#             #response_dict['data']=data_dict
#             response=data_dict
#             #return json.dumps(response_dict)
#             return json.dumps(response) 
#         else:
#             return 'Invalid request!'

#     else:
#        return 'Content-Type not supported!'


@app.route('/trending', methods=['POST'])
def website_trend():
    """
    request format:
    {
        "func":"get_topN_products" or get_topN_attributes
    }

    response format:
    for func="get_topN_products"
    [{
        "product_id": int,
        "category": string,
        "artist": string,
        "theme": string,
        "img_path": string (image path )
     },
     {
        "product_id": int,
        "category": string,
        "artist": string,
        "theme": string,
        "img_path": string (image path )
     },
        so on... upto 5 products
    ]

    for func="get_topN_attributes"
    {
    "category": [
                    {
                        "category_id": int,
                        "category": string,
                        "total_quantity": int
                    },
                    and so on...
                ]
                    ,
    "artist":   [
                    {
                        "artist_id": int,
                        "artist": string,
                        "total_quantity": int
                    },
                    and so on...
                ],
    "theme":    [
                    {
                        "theme_id": int,
                        "theme": string,
                        "total_quantity": int
                    },
                    and so on...
                ]
    }

    """
    content_type = request.headers.get('Content-Type')
    if (content_type == 'application/json'):
        json_dict = request.json
        functionality=json_dict['func']
        #user_id=int(json_dict['user_id'])

        if functionality=='get_topN_products':  
            #response_dict={'title':'Top Products'}
            #response_dict['data']=get_topN_products(N=5)
            response=get_topN_products(N=5)
            #return json.dumps(response_dict)
            return json.dumps(response)

        elif functionality=='get_topN_attributes':
            #response_dict={'func':'get_topN_attributes'}
            category_array,artist_array,themes_array=get_topN_attributes(N=3)
            # data_dict={
            #     "category":{"title":"Top Categories","data":category_array},
            #     "artist":{"title":"Top Artists","data":artist_array},
            #     "theme": {"title":"Top Artists","data":themes_array}
            # }
            data_dict={
                "category":category_array,
                "artist":artist_array,
                "theme":themes_array
            }
            #response_dict['data']=data_dict
            response=data_dict
            #return json.dumps(response_dict)
            return json.dumps(response) 
        elif functionality=='get_product_trend':
            prod_id=json_dict['product_id']
            #output_folder_path='/home/spanidea-168/Documents/SpanIdea_Office_work/Fashion_recommendation_prototype/results'
            months=[1,2,3,4,5,6]
            years=[2022]
            #filepath=get_trend(prod_id,output_folder_path,months,years)
            response=get_product_trend(prod_id,months,years)
            return json.dumps(response)
        else:
            return 'Invalid request!'

    else:
       return 'Content-Type not supported!'

@app.route('/about_project', methods=['GET'])
def about_project():
    content_type = request.headers.get('Content-Type')
    if (content_type == 'application/json'):
        img_dir="/home/spanidea-168/Documents/SpanIdea_Office_work/Fashion_recommendation_prototype/latex"
        #img_dir="img"
        image1_path=f"{img_dir}/mathematical_equation.png"
        image2_path=f"{img_dir}/attribute_considered.png"
        return json.dumps([image1_path,image2_path])
        #img/attribute_considered.jpg
    else:
       return 'Content-Type not supported!' 

@app.route('/client')
def client():
    ip_addr = request.environ['REMOTE_ADDR']
    return '<h1> Your IP address is:' + ip_addr


@app.route('/home', methods=['POST'])
def get_usernames_route():
    """
    request format:
    {
        "func":"get_usernames" 
    }

    response format:
    for func="get_usernamess"
    [{
        "index": int,
        "username": string,
     },
     {
        "index": int,
        "username": string,
     },
        so on... all usernames
    ]
    """
    content_type = request.headers.get('Content-Type')
    if (content_type == 'application/json'):
        json_dict = request.json
        functionality=json_dict['func']
        #user_id=int(json_dict['user_id'])

        if functionality=='get_usernames':  
            #response_dict={'title':'Top Products'}
            #response_dict['data']=get_topN_products(N=5)
            response=get_usernames()
            #return json.dumps(response_dict)
            return json.dumps(response)
        else:
            return 'Invalid request!'

    else:
       return 'Content-Type not supported!'


@app.route('/productData', methods=['POST'])
def get_all_product_names():
    # print("getting products")
    """
    request format:
    {
        "func":"get_products" 
    }

    response format:
    for func="get_product_names"
    [{
        "index": int,
        "product_name": string,
        "product_id": int,
     },
     {
        "index": int,
        "product_name": string,
        "product_id": int,
     },
        so on... all products
    ]
    """
    content_type = request.headers.get('Content-Type')
    if (content_type == 'application/json'):
        json_dict = request.json
        functionality=json_dict['func']
        #user_id=int(json_dict['user_id'])

        if functionality=='get_products':  
            #response_dict={'title':'Top Products'}
            #response_dict['data']=get_topN_products(N=5)
            response=get_product_names()
            #return json.dumps(response_dict)
            return json.dumps(response)
        else:
            return 'Invalid request!'

    else:
       return 'Content-Type not supported!'
