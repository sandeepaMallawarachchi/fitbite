#!/usr/bin/env python3

import os
import sys

# ANSI Colors
BOLD = '\033[1m'
GREEN = '\033[92m'
BLUE = '\033[94m'
YELLOW = '\033[93m'
CYAN = '\033[96m'
END = '\033[0m'

def print_banner():
    print(f"\n{CYAN}{'='*60}{END}")
    print(f"{BOLD}{CYAN}🍽️  FitBite AI - Model Evaluation{END}")
    print(f"{CYAN}{'='*60}{END}\n")

def check_env():
    """Check if .env file exists"""
    if not os.path.exists('.env'):
        print(f"{YELLOW}⚠️  Warning: .env file not found{END}")
        print(f"{YELLOW}   Make sure GROQ_API_KEY is set{END}\n")
        return False
    return True

def main():
    print_banner()
    
    check_env()
    
    print(f"{BOLD}Choose what you want to run:{END}\n")
    print(f"  {GREEN}1.{END} {BOLD}Quick Demo{END} (Recommended)")
    print(f"     • Model info")
    print(f"     • 3 accuracy tests")
    print(f"     • Interactive mode")
    print(f"     • {BLUE}Best for quick screenshots{END}\n")
    
    print(f"  {GREEN}2.{END} {BOLD}Comprehensive Testing{END}")
    print(f"     • Detailed accuracy metrics")
    print(f"     • 4 test cases")
    print(f"     • Performance ratings")
    print(f"     • {BLUE}Best for detailed analysis{END}\n")
    
    print(f"  {GREEN}3.{END} {BOLD}Full Report Generator{END}")
    print(f"     • Complete statistics")
    print(f"     • 10 test cases")
    print(f"     • Response time analysis")
    print(f"     • {BLUE}Best for comprehensive report{END}\n")
    
    print(f"  {GREEN}4.{END} {BOLD}Exit{END}\n")
    
    try:
        choice = input(f"{BOLD}Enter your choice (1-4): {END}").strip()
        
        if choice == '1':
            print(f"\n{GREEN}Launching Quick Demo...{END}\n")
            os.system('python quick_demo.py')
        elif choice == '2':
            print(f"\n{GREEN}Launching Comprehensive Testing...{END}\n")
            os.system('python test_model_demo.py')
        elif choice == '3':
            print(f"\n{GREEN}Generating Full Report...{END}\n")
            print(f"{YELLOW}This will take 1-2 minutes...{END}\n")
            os.system('python generate_report.py')
        elif choice == '4':
            print(f"\n{GREEN}Goodbye!{END}\n")
            sys.exit(0)
        else:
            print(f"\n{YELLOW}Invalid choice. Please run again and select 1-4.{END}\n")
    
    except KeyboardInterrupt:
        print(f"\n\n{YELLOW}Interrupted. Goodbye!{END}\n")
        sys.exit(0)

if __name__ == "__main__":
    main()