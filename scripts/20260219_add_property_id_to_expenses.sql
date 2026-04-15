-- Add property_id to expenses table
ALTER TABLE expenses ADD COLUMN property_id VARCHAR(36) DEFAULT NULL;
ALTER TABLE expenses ADD CONSTRAINT fk_expenses_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE SET NULL;
CREATE INDEX idx_expenses_property_id ON expenses(property_id);