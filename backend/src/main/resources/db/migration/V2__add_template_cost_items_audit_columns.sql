-- template_cost_items was created in V1 without created_at/updated_at,
-- unlike every other table (including its sibling template_assignments).
-- TemplateCostItem extends BaseEntity, which maps both columns on every
-- entity - so any load/merge of a TemplateCostItem row (e.g. right after
-- creating a template with a cost breakdown) fails with
-- "column cb1_0.created_at does not exist". Bring this table in line with
-- the rest of the schema.
ALTER TABLE template_cost_items
    ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT now(),
    ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT now();