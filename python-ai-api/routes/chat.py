from flask import Blueprint, request, jsonify
from models.model_loader import nutrition_ai
from utils.prompt_templates import get_meal_tracking_prompt
from utils.response_parser import parse_nutrition_response

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/chat', methods=['POST'])
def chat():
    """Handle meal tracking chat messages"""
    try:
        data = request.json
        user_data = data.get('userData', {})
        daily_tracking = data.get('dailyTracking', {})
        user_message = data.get('message', '')
        
        if not user_message:
            return jsonify({'error': 'Message is required'}), 400
        
        # Generate prompt
        prompt = get_meal_tracking_prompt(user_data, daily_tracking, user_message)
        
        # Generate response
        response = nutrition_ai.generate_response(prompt, max_tokens=1500)
        
        # Parse nutrition data if present
        nutrition_data = parse_nutrition_response(response)
        
        return jsonify({
            'response': response,
            'nutrition': nutrition_data
        }), 200
        
    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        return jsonify({'error': str(e)}), 500


@chat_bp.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': nutrition_ai.pipeline is not None
    }), 200