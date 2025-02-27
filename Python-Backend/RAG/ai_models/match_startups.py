from vector_db.store_data import store_text
from vector_db.retrieve_data import retrieve_matches

# Example usage
if __name__ == "__main__":
    store_text("Stripe raised $600M", "stripe_01")
    print(retrieve_matches("Fintech startup funding trends"))
