function getAllProducts() {
    showLoading();
    fetch('http://127.0.0.1:5000/products')
        .then(response => response.json())
        .then(data => displayResult(data))
        .catch(error => showError(error));
}

function getProductsByType() {
    const type = prompt('Enter product type (Boty or Shoes or Fitness or Sports):');
    if (type) {
        showLoading();
        fetch(`http://127.0.0.1:5000/products/${type}`)
            .then(response => response.json())
            .then(data => displayResult(data))
            .catch(error => showError(error));
    }
}

function checkProductByManufacturer() {
    const manufacturer = prompt('Enter product by manufacturer to check (example Nike):');
    if (manufacturer) {
        showLoading();
        fetch(`http://127.0.0.1:5000/manufacturer/${manufacturer}`)
            .then(response => response.json())
            .then(data => {
                if (data.count === 0) {
                    alert(`No products found for manufacturer: ${manufacturer}`);
                } else {
                    alert(`There are ${data.count} products by manufacturer: ${manufacturer}`);
                }
                hideLoading();
            })
            .catch(error => showError(error));
    }
}

function getTopCustomers() {
    showLoading();
    fetch('http://127.0.0.1:5000/top-customers')
        .then(response => response.json())
        .then(data => {
            const resultDiv = document.getElementById('result');
            let customersHTML = '<ol>'; // Používáme očíslovaný seznam (HTML <ol>)

            data.forEach((customer, index) => {
                customersHTML += `
                    <li>
                        <strong>${customer.customer_name}</strong><br>
                        Total Sales: ${customer.total_sales}<br>
                        Registration Date: ${customer.registration_date}<br>
                    </li>
                `;
            });

            customersHTML += '</ol>';
            resultDiv.innerHTML = customersHTML;
            hideLoading();
        })
        .catch(error => showError(error));
}

function deleteCustomerByName() {
    const name = prompt('Enter the name of the customer to delete:');
    if (name) {
        showLoading();
        fetch(`http://127.0.0.1:5000/delete-customer?name=${name}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                if (data.deleted_count === 0) {
                    alert('No customer was deleted. Please check the name.');
                } else {
                    alert(`${data.deleted_count} customer(s) deleted.`);
                }
                hideLoading();
            })
            .catch(error => showError(error));
    }
}

function displayResult(data) {
    const resultDiv = document.getElementById('result');
    let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Product Type</th>
                    <th>Manufacturer</th>
                    <th>Price</th>
                    <th>Total Sales</th>
                </tr>
            </thead>
            <tbody>
    `;
    data.forEach(product => {
        tableHTML += `
            <tr>
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.product_type}</td>
                <td>${product.manufacturer}</td>
                <td>${product.price}</td>
                <td>${product.total_sales}</td>
            </tr>
        `;
    });
    tableHTML += `
            </tbody>
        </table>
    `;
    resultDiv.innerHTML = tableHTML;
    hideLoading();
}

function showLoading() {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '<p>Loading...</p>';
}

function showError(error) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    hideLoading();
}

function hideLoading() {
    // Optional: Implement if you have a specific loading element to hide
}
