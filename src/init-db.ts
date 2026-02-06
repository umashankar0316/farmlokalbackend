import { db } from './config/database';

const setupSql = `
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_search (name, description(50))
);

CREATE TABLE IF NOT EXISTS processed_events (
    event_id VARCHAR(255) PRIMARY KEY,
    data JSON,
    processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products (name, description, price) VALUES 
('Fresh Apple', 'Red and juicy', 120.50),
('Organic Banana', 'Farm fresh', 45.00),
('Carrot', 'Crunchy orange roots', 60.00);
`;

async function init() {
    try {
        console.log("Running SQL setup...");
        const queries = setupSql.split(';').filter(q => q.trim().length > 0);
        
        for (const query of queries) {
            await db.execute(query);
        }
        
        console.log("✅ Tables created and data inserted!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
}

init();