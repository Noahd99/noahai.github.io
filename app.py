from flask import Flask, jsonify, request, render_template
from openai import OpenAI

# Initialize the client with your OpenAI API key
OPENAI_API_KEY = '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'
client = OpenAI(api_key=OPENAI_API_KEY)

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/prompt", methods=['POST'])
def prompt():
    json_data = request.get_json()
    question = json_data['question']
    history = json_data['history']
    print(history)
                                
    messages = history+[
         {"role": "system", "content": "You are a funny assistant."},        
        {"role": "user", "content": question}
    ]
        
    print(messages)
    try:
        # Create a completion using the new API client
        completion = client.chat.completions.create(
            model="gpt-4o-mini",  # Use "gpt-4o" or "gpt-4" if it's available for you
            messages=history
        )

        # Extract the response from the completion object
        response_text = completion.choices[0].message.content

        data = {'response': response_text}
        return jsonify(data)

    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == "__main__":
    app.run(debug=True)
