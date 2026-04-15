-- Insert a valid landlord user for testing
INSERT INTO users (
    id, email, password_hash, first_name, last_name, phone, role, is_verified, is_active, avatar_url, date_of_birth, address, city, state, country, created_at, updated_at, last_login
) VALUES (
    'd89894c3-a277-4e27-8c40-6274dbd7b930',
    'landlord@example.com',
    '$2a$10$abcdefghijklmnopqrstuv', -- bcrypt hash placeholder
    'Demo',
    'Landlord',
    '+255123456789',
    'landlord',
    1,
    1,
    NULL,
    NULL,
    NULL,
    'Dar es Salaam',
    'Dar',
    'Tanzania',
    NOW(),
    NOW(),
    NOW()
);
