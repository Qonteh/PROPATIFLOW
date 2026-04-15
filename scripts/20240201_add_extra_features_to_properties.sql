-- Add extra_features JSON column to properties table for advanced features
ALTER TABLE properties ADD COLUMN extra_features JSON DEFAULT NULL;