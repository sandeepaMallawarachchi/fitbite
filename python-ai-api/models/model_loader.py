import os
import requests
from dotenv import load_dotenv

load_dotenv()

class NutritionAIModel:
    def __init__(self):
        self.api_url = "https://api.groq.com/openai/v1/chat/completions"
        self.api_key = os.getenv('GROQ_API_KEY', '')
        self.model = "llama-3.3-70b-versatile"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
    def load_model(self):
        print(f"Using Groq API")
        print(f"Model: Llama 3.3 70B")
        return True
    
    def generate_response(self, prompt, max_tokens=2000):
        try:
            payload = {
                "model": self.model,
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": max_tokens,
                "temperature": 0.7,
                "top_p": 0.9
            }
            
            response = requests.post(
                self.api_url,
                headers=self.headers,
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                return response.json()['choices'][0]['message']['content']
            else:
                raise Exception(f"API Error: {response.status_code}")
        except Exception as e:
            raise e

nutrition_ai = NutritionAIModel()