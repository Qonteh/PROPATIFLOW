-- Migration: Add notes column to expenses table
ALTER TABLE expenses
ADD COLUMN notes TEXT AFTER created_at;