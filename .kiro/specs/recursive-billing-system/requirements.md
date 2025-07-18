# Requirements Document

## Introduction

This document outlines the requirements for a Recursive Billing Customer Management System. The system manages companies that are registered directly in the backend (no registration form needed). Each company has users (Admin/Employees), packages (Add-ons and Basic Packages), and customers. Customers subscribe to packages for specific months, and payments are tracked against these subscriptions.

## Requirements

### Requirement 1

**User Story:** As a system administrator, I want to manage companies and their associated users, so that each company can operate independently within the system.

#### Acceptance Criteria

1. WHEN I access the system THEN I SHALL see companies with fields: name, address, phone_no, email, owner_name, and is_active status
2. WHEN I manage company users THEN the system SHALL allow me to add users with user_type (1=Admin, 2=Employee)
3. WHEN I create a user THEN the system SHALL capture name, username, password, phone_no, user_type, and associate with company_id
4. WHEN I view a company THEN the system SHALL display all associated users, packages, and customers
5. IF a company has active customers THEN the system SHALL prevent company deletion

### Requirement 2

**User Story:** As a business administrator, I want to create and manage packages with two types (add_on and package), so that I can offer different subscription options to customers.

#### Acceptance Criteria

1. WHEN I create a package THEN the system SHALL allow me to specify the type as either "add_on" or "package"
2. WHEN I create a package THEN the system SHALL allow me to set name, price_per_month, and associate it with my company
3. WHEN I view packages THEN the system SHALL display packages filtered by type (add_on, package) with soft delete functionality
4. WHEN I delete a package THEN the system SHALL soft delete it by setting is_deleted to true and recording deleted_at timestamp
5. IF a package has active subscriptions THEN the system SHALL prevent permanent deletion but allow soft deletion

### Requirement 3

**User Story:** As a business administrator, I want to manage customer information and their subscription history, so that I can track customer relationships and billing status.

#### Acceptance Criteria

1. WHEN I add a customer THEN the system SHALL capture first_name, last_name, care_of, phone, address, box_no, note, latitude, longitude, old_due, and associate with company_id
2. WHEN I view a customer THEN the system SHALL display current subscriptions, payment history, and total due amount (old_due + subscription_due - payments_made)
3. WHEN I edit customer information THEN the system SHALL maintain subscription and payment history integrity
4. WHEN I delete a customer THEN the system SHALL soft delete by setting is_deleted to true, recording deleted_at timestamp and deleted_by user
5. WHEN I view the customer list THEN the system SHALL display customers in a paginated table with search functionality, excluding soft-deleted records

### Requirement 4

**User Story:** As a business administrator, I want customers to subscribe to packages for specific months, so that I can track their subscription commitments.

#### Acceptance Criteria

1. WHEN a customer subscribes THEN the system SHALL create a subscription record with the number of months they want to subscribe
2. WHEN a customer subscribes THEN the system SHALL allow them to select one Basic Package and multiple Add-ons
3. WHEN I view a subscription THEN the system SHALL display the selected package, add-ons, duration in months, and total subscription amount
4. WHEN calculating subscription dues THEN the system SHALL multiply monthly rates by the number of subscribed months

### Requirement 5

**User Story:** As a business administrator, I want to track customer payments against their subscriptions, so that I can manage outstanding dues effectively.

#### Acceptance Criteria

1. WHEN a customer makes a payment THEN the system SHALL record the payment amount against their subscription
2. WHEN I view customer payments THEN the system SHALL display all payment records with dates and amounts
3. WHEN calculating due amounts THEN the system SHALL show total subscription amount minus payments made plus any old dues from previous systems
4. WHEN I view a customer THEN the system SHALL display their current due amount prominently

### Requirement 6

**User Story:** As a business administrator, I want to use consistent UI components across all pages, so that the system provides a cohesive user experience.

#### Acceptance Criteria

1. WHEN I navigate between different pages THEN the system SHALL use consistent table components with sorting and filtering
2. WHEN viewing paginated data THEN the system SHALL use consistent pagination components across all list views
3. WHEN performing CRUD operations THEN the system SHALL use consistent form components and validation patterns
4. WHEN displaying data THEN the system SHALL use consistent styling with ShadCN components and TailwindCSS

### Requirement 7

**User Story:** As a business administrator, I want comprehensive customer management pages, so that I can efficiently handle all customer-related operations.

#### Acceptance Criteria

1. WHEN I access customer management THEN the system SHALL provide table, view, edit, and add customer pages
2. WHEN I view the customer table THEN the system SHALL display key customer information with action buttons
3. WHEN I view a customer detail page THEN the system SHALL show complete customer information, subscriptions, and billing history
4. WHEN I edit or add a customer THEN the system SHALL provide form validation and error handling

### Requirement 8

**User Story:** As a business administrator, I want to manage all system entities through dedicated pages, so that I can maintain complete control over the billing system.

#### Acceptance Criteria

1. WHEN I access the system THEN I SHALL have dedicated management pages for companies, users, packages, add-ons, customers, subscriptions, and bills
2. WHEN I navigate between entity pages THEN the system SHALL maintain consistent navigation and layout
3. WHEN I perform operations on any entity THEN the system SHALL provide appropriate feedback and error handling
4. WHEN viewing related entities THEN the system SHALL provide navigation links between related records