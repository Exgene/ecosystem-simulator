from flask import Flask, jsonify, request
from flask_cors import CORS
import main
#app instance
app = Flask(__name__)
CORS(app)

@app.route('/api/main',methods=["GET","POST"])
def return_main():
    data = request.get_json()
    print(data)
    returnData = main.simulate_ecosystem_with_nn(20)
    return jsonify({
        "text":"Successfull",
        "returnData":returnData
    })
    

if __name__=="__main__":
    app.run(debug=True,port=8080)