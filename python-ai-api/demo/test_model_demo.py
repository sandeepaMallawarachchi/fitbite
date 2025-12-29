"""
FitBite AI Nutrition Model - Demo & Testing Script
This script demonstrates the model's capabilities with detailed console outputs
"""

import os
import sys
import time
import json
from datetime import datetime
from dotenv import load_dotenv
import requests

# Load environment variables
load_dotenv()

# Color codes for terminal output
class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

def print_header(text):
    """Print formatted header"""
    print(f"\n{Colors.HEADER}{Colors.BOLD}{'='*70}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{text.center(70)}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{'='*70}{Colors.ENDC}\n")

def print_section(text):
    """Print section header"""
    print(f"\n{Colors.OKCYAN}{Colors.BOLD}{'─'*70}{Colors.ENDC}")
    print(f"{Colors.OKCYAN}{Colors.BOLD}{text}{Colors.ENDC}")
    print(f"{Colors.OKCYAN}{Colors.BOLD}{'─'*70}{Colors.ENDC}")

def print_success(text):
    """Print success message"""
    print(f"{Colors.OKGREEN}✓ {text}{Colors.ENDC}")

def print_info(text):
    """Print info message"""
    print(f"{Colors.OKBLUE}ℹ {text}{Colors.ENDC}")

def print_warning(text):
    """Print warning message"""
    print(f"{Colors.WARNING}⚠ {text}{Colors.ENDC}")

def print_error(text):
    """Print error message"""
    print(f"{Colors.FAIL}✗ {text}{Colors.ENDC}")

class ModelTester:
    def __init__(self):
        self.api_url = "https://api.groq.com/openai/v1/chat/completions"
        self.api_key = os.getenv('GROQ_API_KEY', '')
        self.model = "llama-3.3-70b-versatile"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        self.test_results = []
        
    def display_model_info(self):
        """Display detailed model information"""
        print_header("FitBite AI Nutrition Model Information")
        
        print_section("Model Specifications")
        print(f"  {Colors.BOLD}Model Name:{Colors.ENDC} {self.model}")
        print(f"  {Colors.BOLD}Provider:{Colors.ENDC} Groq Cloud (Llama 3.3 70B)")
        print(f"  {Colors.BOLD}Parameters:{Colors.ENDC} 70 Billion")
        print(f"  {Colors.BOLD}Context Window:{Colors.ENDC} 8,192 tokens")
        print(f"  {Colors.BOLD}Max Output Tokens:{Colors.ENDC} 2,500 tokens")
        print(f"  {Colors.BOLD}Temperature:{Colors.ENDC} 0.7 (Balanced creativity)")
        print(f"  {Colors.BOLD}Top-P:{Colors.ENDC} 0.9 (Nucleus sampling)")
        
        print_section("Model Capabilities")
        print(f"  • {Colors.OKGREEN}Meal Nutrition Analysis{Colors.ENDC} - Calculate calories, carbs, protein, fat")
        print(f"  • {Colors.OKGREEN}Macro Distribution{Colors.ENDC} - Goal-based macro recommendations")
        print(f"  • {Colors.OKGREEN}Meal Plan Generation{Colors.ENDC} - Daily meal plans with 4 meals")
        print(f"  • {Colors.OKGREEN}Dietary Preferences{Colors.ENDC} - Supports various dietary requirements")
        print(f"  • {Colors.OKGREEN}Medical Considerations{Colors.ENDC} - Adapts to health conditions")
        
        print_section("System Configuration")
        print(f"  {Colors.BOLD}API Status:{Colors.ENDC} ", end="")
        if self.test_connection():
            print_success("Connected")
        else:
            print_error("Connection Failed")
        print(f"  {Colors.BOLD}Environment:{Colors.ENDC} {os.getenv('FLASK_ENV', 'production')}")
        print(f"  {Colors.BOLD}Server Port:{Colors.ENDC} {os.getenv('PORT', '5001')}")
        
    def test_connection(self):
        """Test API connection"""
        try:
            payload = {
                "model": self.model,
                "messages": [{"role": "user", "content": "test"}],
                "max_tokens": 10
            }
            response = requests.post(self.api_url, headers=self.headers, json=payload, timeout=10)
            return response.status_code == 200
        except:
            return False
    
    def run_accuracy_tests(self):
        """Run comprehensive accuracy tests"""
        print_header("Model Accuracy Testing")
        
        # Test cases with expected ranges
        test_cases = [
            {
                "name": "Simple Meal - 2 Eggs",
                "input": "2 large boiled eggs",
                "expected": {"calories": (140, 160), "protein": (12, 14), "fat": (9, 11), "carbs": (0, 2)},
                "category": "Basic Foods"
            },
            {
                "name": "Complex Meal - Chicken Rice",
                "input": "200g grilled chicken breast with 150g brown rice and vegetables",
                "expected": {"calories": (480, 550), "protein": (55, 65), "fat": (5, 10), "carbs": (50, 60)},
                "category": "Complete Meals"
            },
            {
                "name": "Breakfast - Oatmeal",
                "input": "100g oatmeal with 200ml milk and 1 banana",
                "expected": {"calories": (420, 480), "protein": (15, 20), "fat": (8, 12), "carbs": (70, 85)},
                "category": "Breakfast Foods"
            },
            {
                "name": "Snack - Greek Yogurt",
                "input": "200g greek yogurt with 30g honey",
                "expected": {"calories": (220, 260), "protein": (18, 22), "fat": (0, 5), "carbs": (30, 40)},
                "category": "Snacks"
            }
        ]
        
        total_tests = len(test_cases)
        passed_tests = 0
        accuracy_scores = []
        
        for idx, test in enumerate(test_cases, 1):
            print_section(f"Test {idx}/{total_tests}: {test['name']}")
            print(f"  {Colors.BOLD}Category:{Colors.ENDC} {test['category']}")
            print(f"  {Colors.BOLD}Input:{Colors.ENDC} {test['input']}")
            print(f"  {Colors.BOLD}Processing...{Colors.ENDC}", end="", flush=True)
            
            start_time = time.time()
            result = self.analyze_meal(test['input'])
            end_time = time.time()
            
            if result:
                print(f"\r  {Colors.BOLD}Response Time:{Colors.ENDC} {(end_time - start_time):.2f}s")
                
                print(f"\n  {Colors.BOLD}Predicted Values:{Colors.ENDC}")
                print(f"    Calories: {result['calories']:.1f} kcal")
                print(f"    Protein:  {result['protein']:.1f}g")
                print(f"    Carbs:    {result['carbs']:.1f}g")
                print(f"    Fat:      {result['fat']:.1f}g")
                
                print(f"\n  {Colors.BOLD}Expected Ranges:{Colors.ENDC}")
                print(f"    Calories: {test['expected']['calories'][0]}-{test['expected']['calories'][1]} kcal")
                print(f"    Protein:  {test['expected']['protein'][0]}-{test['expected']['protein'][1]}g")
                print(f"    Carbs:    {test['expected']['carbs'][0]}-{test['expected']['carbs'][1]}g")
                print(f"    Fat:      {test['expected']['fat'][0]}-{test['expected']['fat'][1]}g")
                
                # Calculate accuracy
                accuracy = self.calculate_accuracy(result, test['expected'])
                accuracy_scores.append(accuracy)
                
                print(f"\n  {Colors.BOLD}Accuracy:{Colors.ENDC} ", end="")
                if accuracy >= 85:
                    print_success(f"{accuracy:.1f}% - Excellent")
                    passed_tests += 1
                elif accuracy >= 70:
                    print_warning(f"{accuracy:.1f}% - Good")
                    passed_tests += 1
                else:
                    print_error(f"{accuracy:.1f}% - Needs Improvement")
                
                self.test_results.append({
                    "test": test['name'],
                    "passed": accuracy >= 70,
                    "accuracy": accuracy,
                    "result": result
                })
            else:
                print(f"\r  {Colors.FAIL}✗ Test Failed - No Response{Colors.ENDC}")
            
            time.sleep(0.5)  # Brief pause between tests
        
        # Display summary
        self.display_accuracy_summary(passed_tests, total_tests, accuracy_scores)
    
    def calculate_accuracy(self, result, expected):
        """Calculate accuracy percentage"""
        accuracies = []
        
        for nutrient in ['calories', 'protein', 'carbs', 'fat']:
            value = result.get(nutrient, 0)
            min_val, max_val = expected[nutrient]
            
            if min_val <= value <= max_val:
                accuracies.append(100)
            else:
                # Calculate how far off from the range
                if value < min_val:
                    error = (min_val - value) / min_val * 100
                else:
                    error = (value - max_val) / max_val * 100
                
                accuracy = max(0, 100 - error)
                accuracies.append(accuracy)
        
        return sum(accuracies) / len(accuracies)
    
    def display_accuracy_summary(self, passed, total, scores):
        """Display test summary"""
        print_header("Test Results Summary")
        
        avg_accuracy = sum(scores) / len(scores) if scores else 0
        pass_rate = (passed / total * 100) if total > 0 else 0
        
        print(f"  {Colors.BOLD}Tests Passed:{Colors.ENDC} {passed}/{total} ({pass_rate:.1f}%)")
        print(f"  {Colors.BOLD}Average Accuracy:{Colors.ENDC} {avg_accuracy:.1f}%")
        
        print(f"\n  {Colors.BOLD}Accuracy Distribution:{Colors.ENDC}")
        for idx, score in enumerate(scores, 1):
            bar_length = int(score / 2)  # Scale to 50 chars max
            bar = "█" * bar_length
            print(f"    Test {idx}: {bar} {score:.1f}%")
        
        print(f"\n  {Colors.BOLD}Overall Rating:{Colors.ENDC} ", end="")
        if avg_accuracy >= 90:
            print_success("Excellent Performance")
        elif avg_accuracy >= 80:
            print_success("Good Performance")
        elif avg_accuracy >= 70:
            print_warning("Acceptable Performance")
        else:
            print_error("Needs Improvement")
    
    def analyze_meal(self, meal_text):
        """Analyze a meal and return nutrition data"""
        try:
            prompt = f"""Analyze this meal and return ONLY the total nutrition values.

Meal: {meal_text}

Return in this format:
Calories: [number] kcal
Protein: [number]g
Carbs: [number]g
Fat: [number]g

Be precise and accurate with nutrition values."""

            payload = {
                "model": self.model,
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 500,
                "temperature": 0.3
            }
            
            response = requests.post(self.api_url, headers=self.headers, json=payload, timeout=30)
            
            if response.status_code == 200:
                text = response.json()['choices'][0]['message']['content']
                return self.parse_nutrition(text)
            return None
        except Exception as e:
            print_error(f"Error: {str(e)}")
            return None
    
    def parse_nutrition(self, text):
        """Parse nutrition values from text"""
        import re
        
        try:
            nutrition = {}
            
            cal_match = re.search(r'Calories?:\s*(\d+(?:\.\d+)?)', text, re.IGNORECASE)
            if cal_match:
                nutrition['calories'] = float(cal_match.group(1))
            
            protein_match = re.search(r'Protein:\s*(\d+(?:\.\d+)?)g?', text, re.IGNORECASE)
            if protein_match:
                nutrition['protein'] = float(protein_match.group(1))
            
            carbs_match = re.search(r'Carbs?:\s*(\d+(?:\.\d+)?)g?', text, re.IGNORECASE)
            if carbs_match:
                nutrition['carbs'] = float(carbs_match.group(1))
            
            fat_match = re.search(r'Fat:\s*(\d+(?:\.\d+)?)g?', text, re.IGNORECASE)
            if fat_match:
                nutrition['fat'] = float(fat_match.group(1))
            
            if len(nutrition) == 4:
                return nutrition
            return None
        except:
            return None
    
    def interactive_mode(self):
        """Interactive meal analysis mode"""
        print_header("Interactive Meal Analysis Mode")
        print_info("Enter your meals to analyze nutrition. Type 'exit' to quit.\n")
        
        while True:
            try:
                meal_input = input(f"{Colors.BOLD}Enter your meal: {Colors.ENDC}").strip()
                
                if meal_input.lower() in ['exit', 'quit', 'q']:
                    print_info("Exiting interactive mode...")
                    break
                
                if not meal_input:
                    print_warning("Please enter a meal description.")
                    continue
                
                print(f"\n{Colors.BOLD}Analyzing...{Colors.ENDC}", end="", flush=True)
                
                start_time = time.time()
                result = self.analyze_meal(meal_input)
                end_time = time.time()
                
                if result:
                    print(f"\r{Colors.OKGREEN}✓ Analysis Complete{Colors.ENDC} (Response time: {(end_time - start_time):.2f}s)\n")
                    
                    print(f"{Colors.BOLD}Nutrition Information:{Colors.ENDC}")
                    print(f"  Calories: {result['calories']:.1f} kcal")
                    print(f"  Protein:  {result['protein']:.1f}g")
                    print(f"  Carbs:    {result['carbs']:.1f}g")
                    print(f"  Fat:      {result['fat']:.1f}g\n")
                else:
                    print(f"\r{Colors.FAIL}✗ Analysis Failed{Colors.ENDC}\n")
                
            except KeyboardInterrupt:
                print(f"\n{Colors.WARNING}Interrupted by user{Colors.ENDC}")
                break
            except Exception as e:
                print_error(f"Error: {str(e)}")

def main():
    """Main execution function"""
    print_header("FitBite AI Nutrition Model - Testing & Demo Suite")
    print(f"  {Colors.BOLD}Date:{Colors.ENDC} {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"  {Colors.BOLD}Version:{Colors.ENDC} 1.0.0")
    print(f"  {Colors.BOLD}Purpose:{Colors.ENDC} Model Evaluation & Demonstration\n")
    
    tester = ModelTester()
    
    # Display menu
    while True:
        print_section("Main Menu")
        print(f"  1. {Colors.OKBLUE}Display Model Information{Colors.ENDC}")
        print(f"  2. {Colors.OKBLUE}Run Accuracy Tests{Colors.ENDC}")
        print(f"  3. {Colors.OKBLUE}Interactive Meal Analysis{Colors.ENDC}")
        print(f"  4. {Colors.OKBLUE}Run All Tests{Colors.ENDC}")
        print(f"  5. {Colors.OKBLUE}Exit{Colors.ENDC}")
        
        try:
            choice = input(f"\n{Colors.BOLD}Select option (1-5): {Colors.ENDC}").strip()
            
            if choice == '1':
                tester.display_model_info()
            elif choice == '2':
                tester.run_accuracy_tests()
            elif choice == '3':
                tester.interactive_mode()
            elif choice == '4':
                tester.display_model_info()
                time.sleep(2)
                tester.run_accuracy_tests()
                time.sleep(1)
                input(f"\n{Colors.BOLD}Press Enter to continue to interactive mode...{Colors.ENDC}")
                tester.interactive_mode()
            elif choice == '5':
                print_info("Thank you for using FitBite AI Testing Suite!")
                break
            else:
                print_warning("Invalid option. Please select 1-5.")
        
        except KeyboardInterrupt:
            print(f"\n{Colors.WARNING}Interrupted by user{Colors.ENDC}")
            break
        except Exception as e:
            print_error(f"Error: {str(e)}")

if __name__ == "__main__":
    main()