from flask import Flask, request, jsonify
import psycopg2
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def get_db_connection():
    conn = psycopg2.connect(database='sportsstore', user='koyeb-adm', password='RmiEvoMz7a3s', host='ep-white-band-a2h03cgc.eu-central-1.pg.koyeb.app', port='5432')
    return conn

def format_product(row):
    return {
        'id': row[0],
        'name': row[1],
        'product_type': row[2],
        'manufacturer': row[3],
        'price': row[4],
        'total_sales': row[5]
    }

@app.route('/products', methods=['GET'])
def get_all_products():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM sportsstore;')
    rows = cur.fetchall()
    conn.close()
    formatted_rows = [format_product(row) for row in rows]
    return jsonify(formatted_rows)

@app.route('/products/<product_type>', methods=['GET'])
def get_products_by_type(product_type):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM sportsstore WHERE product_type = %s;', (product_type,))
    rows = cur.fetchall()
    conn.close()
    formatted_rows = [format_product(row) for row in rows]
    return jsonify(formatted_rows)

@app.route('/manufacturer/<manufacturer_name>', methods=['GET'])
def check_product_by_manufacturer(manufacturer_name):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM sportsstore WHERE manufacturer = %s;', (manufacturer_name,))
    products = cur.fetchall()
    conn.close()
    return jsonify({'products': products})

@app.route('/top-customers', methods=['GET'])
def get_top_customers():
    conn = get_db_connection()
    cur = conn.cursor()
    # Seřadím podle total_sales sestupně a vybereme 5 zákazníků
    cur.execute('SELECT customer_id, customer_name, registration_date, total_sales FROM customers ORDER BY total_sales DESC LIMIT 5;')
    rows = cur.fetchall()
    conn.close()
    customers = [{'customer_id': row[0], 'customer_name': row[1], 'registration_date': row[2], 'total_sales': row[3]} for row in rows]
    return jsonify(customers)

@app.route('/customers', methods=['GET'])
def get_all_customers():
    conn = get_db_connection()
    cur = conn.cursor()
    # Vybereme všechny zákazníky
    cur.execute('SELECT customer_id, customer_name, registration_date, total_sales FROM customers ORDER BY customer_name ASC;')
    rows = cur.fetchall()
    conn.close()
    customers = [{'customer_id': row[0], 'customer_name': row[1], 'registration_date': row[2], 'total_sales': row[3]} for row in rows]
    return jsonify(customers)


@app.route('/delete-customer', methods=['DELETE'])
def delete_customer_by_name():
    customer_name = request.args.get('name')
    
    if not customer_name:
        return jsonify({'error': 'No customer name provided'}), 400
    
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('DELETE FROM customers WHERE customer_name = %s;', (customer_name,))
    deleted_count = cur.rowcount
    conn.commit()
    conn.close()
    
    return jsonify({'deleted_count': deleted_count})

if __name__ == '__main__':
    app.run(debug=True)