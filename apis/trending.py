#Imports
from flask import Flask, request
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import json
from sqlalchemy import create_engine
from apis.fetch_visualize_user_data import get_all_charts
from apis.fetch_user_recommendations import get_user_recommendations
from apis.TopN import get_topN_products,get_topN_attributes
from flask_cors import CORS, cross_origin

# create sqlalchemy engine and connect to local database
#Caution: Do not keep special characters in password or db name 

engine = create_engine("mysql+pymysql://{user}:{pw}@localhost/{db}"
                       .format(user="root",
                        pw="span%40123",    #real password is span@123, but url encoded password is required
                        db="Fashion_db"))

app = Flask(__name__)
CORS(app)

@app.route('/trending', methods=['POST'])
def process_json():
    content_type = request.headers.get('Content-Type')
    if (content_type == 'application/json'):
        json_dict = request.json
        functionality=json_dict['func']
        #user_id=int(json_dict['user_id'])

        if functionality=='get_topN_products':  
            response_dict={'title':'Top Products'}
            response_dict['data']=get_topN_products(N=5)
            #response=get_topN_products(N=5)
            #return json.dumps(response_dict)
            return json.dumps(response_dict)

        elif functionality=='get_topN_attributes':
            #response_dict={'func':'get_topN_attributes'}
            category_array,artist_array,themes_array=get_topN_attributes(N=3)
            data_dict={
                "category":{"title":"Top Categories","data":category_array},
                "artist":{"title":"Top Artists","data":artist_array},
                "theme": {"title":"Top Artists","data":themes_array}
            }
            #response_dict['data']=data_dict
            response=data_dict
            #return json.dumps(response_dict)
            return json.dumps(response) 
        else:
            return 'Invalid request!'

    else:
       return 'Content-Type not supported!'