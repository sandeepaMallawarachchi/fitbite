from flask import Blueprint, request, jsonify
from models.model_loader import nutrition_ai
from utils.prompt_templates import get_meal_plan_generation_prompt
from utils.response_parser import clean_json_response
from datetime import datetime

meal_plan_bp = Blueprint('meal_plan', __name__)

@meal_plan_bp.route('/generate-meal-plan', methods=['POST'])
def generate_meal_plan():
    """Generate a complete meal plan"""
    try:
        data = request.json
        user_data = data.get('userData', {})
        
        if not user_data:
            return jsonify({'error': 'User data is required'}), 400
        
        # Generate prompt
        prompt = get_meal_plan_generation_prompt(user_data)
        
        # Generate response with higher token limit
        response = nutrition_ai.generate_response(prompt, max_tokens=2500)
        
        # Clean and parse JSON
        meal_plan = clean_json_response(response)
        
        if not meal_plan:
            return jsonify({'error': 'Failed to generate valid meal plan'}), 500
        
        # Add current date if not present
        if 'date' not in meal_plan:
            meal_plan['date'] = datetime.now().strftime('%Y-%m-%d')
        
        # Ensure userId is set
        meal_plan['userId'] = user_data.get('userId', '')
        
        return jsonify(meal_plan), 200
        
    except Exception as e:
        print(f"Error generating meal plan: {str(e)}")
        return jsonify({'error': str(e)}), 500