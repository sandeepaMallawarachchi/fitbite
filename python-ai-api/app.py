from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Import routes
from routes.chat import chat_bp
from routes.meal_plan import meal_plan_bp

# Import model
from models.model_loader import nutrition_ai

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Enable CORS
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:5173", "http://localhost:3000", "https://fitbite-three.vercel.app"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Register blueprints
app.register_blueprint(chat_bp, url_prefix='/api')
app.register_blueprint(meal_plan_bp, url_prefix='/api')

# Root endpoint
@app.route('/')
def home():
    return jsonify({
        'message': 'FitBite AI API',
        'version': '1.0.0',
        'status': 'running'
    })

# Health check
@app.route('/health')
def health():
    return jsonify({
        'status': 'healthy',
        'model': 'loaded' if nutrition_ai.pipeline else 'not loaded'
    })

if __name__ == '__main__':
    print("Starting FitBite AI API...")
    print("Loading AI model...")
    
    if nutrition_ai.load_model():
        print("Model loaded successfully!")
        port = int(os.getenv('PORT', 5001))
        print(f"Starting Flask server on port {port}...")
        
        app.run(
            host='0.0.0.0',
            port=port,
            debug=False  # Always False in production
        )
    else:
        print("Failed to load model. Exiting...")
        exit(1)