// Tab Switching Logic
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all tabs
        tabBtns.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        // Add active class to clicked tab
        btn.classList.add('active');
        const targetId = btn.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');
    });
});

// Utility function for delayed execution (simulating network/work)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const clearOutput = (id) => {
    const el = document.getElementById(id);
    if(el) { 
        el.innerHTML = ''; 
        el.className = 'output-box log-box'; 
        el.style.display = 'block';
    }
};

const appendOutput = (id, message, type = '') => {
    const el = document.getElementById(id);
    if(el) {
        el.style.display = 'block';
        const p = document.createElement('p');
        p.textContent = message;
        if(type) p.className = type;
        el.appendChild(p);
    }
};

// Task 1: Calculate Bill
document.getElementById('btn-calc-bill').addEventListener('click', () => {
    const prices = [150, 450, 200, 800, 100];
    const threshold = 1000;
    const discountRate = 0.10; // 10% discount
    
    const totalBill = prices.reduce((acc, curr) => acc + curr, 0);
    let finalAmount = totalBill;
    let appliedDiscount = 0;

    if (totalBill > threshold) {
        appliedDiscount = totalBill * discountRate;
        finalAmount = totalBill - appliedDiscount;
    }

    const output = document.getElementById('task1-output');
    output.style.display = 'block';
    output.innerHTML = `
        <p>Item Prices: $${prices.join(', $')}</p>
        <p>Total Bill: $${totalBill.toFixed(2)}</p>
        <p>Discount Applied: $${appliedDiscount.toFixed(2)}</p>
        <p style="color: var(--success); font-weight: bold; margin-top: 0.5rem;">Final Amount: $${finalAmount.toFixed(2)}</p>
    `;
});

// Task 2: Dynamic Buttons
const dynamicBtns = document.querySelectorAll('.dynamic-btn');
dynamicBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const originalText = this.textContent;
        // Using 'this' keyword to refer to the clicked button
        this.textContent = `Clicked ${originalText.split(' ')[0]}!`;
        this.style.backgroundColor = 'var(--success)';
        
        setTimeout(() => {
            this.textContent = originalText;
            this.style.backgroundColor = '';
        }, 1000);
    });
});

// Task 3: Character Counter
const task3Input = document.getElementById('task3-input');
const task3Count = document.getElementById('task3-count');
task3Input.addEventListener('input', function() {
    // Dynamically update characters count
    task3Count.textContent = this.value.length;
});

// Task 4: Registration Form
document.getElementById('reg-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const mobile = document.getElementById('reg-mobile').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirm = document.getElementById('reg-confirm').value;
    const gender = document.getElementById('reg-gender').value;
    
    const output = document.getElementById('reg-output');
    output.className = 'output-box';
    output.style.display = 'block';

    // Basic Validations
    if (!name || !mobile || !email || !password || !gender) {
        output.textContent = 'All fields are required.';
        output.classList.add('error');
        return;
    }

    if (password !== confirm) {
        output.textContent = 'Passwords do not match.';
        output.classList.add('error');
        return;
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile)) {
        output.textContent = 'Invalid mobile number. Must be exactly 10 digits.';
        output.classList.add('error');
        return;
    }

    output.textContent = `Registration successful for ${name}!`;
    output.classList.add('success');
    e.target.reset();
});

// Task 5: Callbacks (Nested)
document.getElementById('btn-callbacks').addEventListener('click', () => {
    const outId = 'task5-output';
    clearOutput(outId);
    
    const selectFood = (callback) => {
        appendOutput(outId, 'Selecting Food...');
        setTimeout(() => callback(), 800);
    };
    const confirmOrder = (callback) => {
        appendOutput(outId, 'Confirming Order...');
        setTimeout(() => callback(), 800);
    };
    const prepareFood = (callback) => {
        appendOutput(outId, 'Preparing Food...');
        setTimeout(() => callback(), 1200);
    };
    const assignDelivery = (callback) => {
        appendOutput(outId, 'Assigning Delivery Partner...');
        setTimeout(() => callback(), 800);
    };
    const deliverFood = () => {
        appendOutput(outId, 'Food Delivered Successfully!', 'success');
    };

    // Callback Hell (Nested Callbacks) Demonstration
    selectFood(() => {
        confirmOrder(() => {
            prepareFood(() => {
                assignDelivery(() => {
                    deliverFood();
                });
            });
        });
    });
});

// Task 6: Promises (Chaining)
document.getElementById('btn-promises').addEventListener('click', () => {
    const outId = 'task6-output';
    clearOutput(outId);

    const selectProduct = () => new Promise(resolve => {
        appendOutput(outId, 'Selecting Product...');
        setTimeout(resolve, 800);
    });
    const checkAvailability = () => new Promise(resolve => {
        appendOutput(outId, 'Checking Availability...');
        setTimeout(resolve, 800);
    });
    const addToCart = () => new Promise(resolve => {
        appendOutput(outId, 'Adding to Cart...');
        setTimeout(resolve, 800);
    });
    const makePayment = () => new Promise(resolve => {
        appendOutput(outId, 'Making Payment...');
        setTimeout(resolve, 1200);
    });
    const generateOrder = () => new Promise(resolve => {
        appendOutput(outId, 'Generating Order Confirmation...', 'success');
        setTimeout(resolve, 500);
    });

    // Promise Chaining Demonstration
    selectProduct()
        .then(checkAvailability)
        .then(addToCart)
        .then(makePayment)
        .then(generateOrder)
        .catch(err => appendOutput(outId, `Error: ${err}`, 'error'));
});

// Task 7: Async/Await with try...catch
document.getElementById('btn-async').addEventListener('click', async () => {
    const outId = 'task7-output';
    clearOutput(outId);

    const selectMovie = async () => { appendOutput(outId, 'Selecting Movie...'); await delay(800); };
    const checkSeat = async () => { appendOutput(outId, 'Checking Seat Availability...'); await delay(800); };
    const reserveSeat = async () => { appendOutput(outId, 'Reserving Seat...'); await delay(800); };
    const makePayment = async () => { appendOutput(outId, 'Making Payment...'); await delay(1200); };
    const generateTicket = async () => { appendOutput(outId, 'Generating Ticket...', 'success'); await delay(500); };

    // Async/Await Demonstration
    try {
        await selectMovie();
        await checkSeat();
        await reserveSeat();
        await makePayment();
        await generateTicket();
    } catch (error) {
        appendOutput(outId, `Error: ${error.message}`, 'error');
    }
});
