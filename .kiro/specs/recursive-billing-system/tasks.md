# Implementation Plan

## Backend Tasks

### 1. Create Missing Models and Controllers

- [ ] 1.1 Create Subscription model
  - Create subscription.model.ts with fields: customer_id, package_id, add_on_ids, subscription_months, monthly_amount, total_amount, start_date, end_date, is_active, company_id
  - Add proper TypeScript interfaces and Mongoose schema
  - Include soft delete functionality (is_deleted, deleted_at)
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 1.2 Create Payment model
  - Create payment.model.ts with fields: customer_id, subscription_id, amount, payment_date, payment_method, notes, company_id, created_by
  - Add proper TypeScript interfaces and Mongoose schema
  - _Requirements: 5.1, 5.2_

- [ ] 1.3 Create Subscription controller
  - Create subscription.controller.ts with CRUD operations
  - Implement createSubscription, getAllSubscriptions, getSubscriptionById, updateSubscription, deleteSubscription methods
  - Add company-based filtering and user authentication
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 1.4 Create Payment controller
  - Create payment.controller.ts with CRUD operations
  - Implement createPayment, getAllPayments, getPaymentById, updatePayment, deletePayment methods
  - Add methods to calculate customer due amounts
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

### 2. Create API Routes and Schemas

- [ ] 2.1 Create subscription routes
  - Create subscription.routes.ts with all CRUD endpoints
  - Add authentication and authorization middleware
  - Include bulk operations for subscriptions
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 2.2 Create payment routes
  - Create payment.routes.ts with all CRUD endpoints
  - Add authentication and authorization middleware
  - Include endpoints for due amount calculations
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 2.3 Create subscription validation schemas
  - Create subscription.schema.ts with Zod validation schemas
  - Include createSubscriptionSchema, updateSubscriptionSchema, subscriptionQuerySchema
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 2.4 Create payment validation schemas
  - Create payment.schema.ts with Zod validation schemas
  - Include createPaymentSchema, updatePaymentSchema, paymentQuerySchema
  - _Requirements: 5.1, 5.2_

### 3. Create Services and Types

- [ ] 3.1 Create subscription service
  - Create subscription.service.ts with business logic
  - Implement subscription creation, calculation logic, and due amount calculations
  - Add methods to handle package and add-on associations
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 3.2 Create payment service
  - Create payment.service.ts with business logic
  - Implement payment processing and due amount updates
  - Add methods to calculate total customer dues (old_due + subscription_due - payments)
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 3.3 Create TypeScript type definitions
  - Create Subscription.ts and Payment.ts in types folder
  - Define interfaces for API requests and responses
  - _Requirements: 4.1, 5.1_

### 4. Update Existing Backend Components

- [ ] 4.1 Update customer controller with due calculations
  - Modify customer.controller.ts to include subscription and payment data in customer views
  - Add methods to calculate and display total due amounts
  - Update getCustomerById to include subscription and payment history
  - _Requirements: 3.2, 5.4_

- [ ] 4.2 Update main routes file
  - Add subscription and payment routes to routes.ts
  - Ensure proper route organization
  - _Requirements: 4.1, 5.1_

## Frontend Tasks

### 5. Create Common Reusable Components

- [ ] 5.1 Create enhanced Table component
  - Create a reusable DataTable component in components/common/
  - Include sorting, filtering, pagination, and selection functionality
  - Make it generic to work with any data type
  - _Requirements: 6.1, 6.2_

- [ ] 5.2 Create enhanced Pagination component
  - Create a comprehensive Pagination component in components/common/
  - Include page size selection and navigation controls
  - Make it consistent across all list views
  - _Requirements: 6.2_

- [ ] 5.3 Create Form components
  - Create FormField, FormSelect, FormDatePicker, FormTextarea components
  - Ensure consistent styling and validation patterns
  - Use ShadCN components as base
  - _Requirements: 6.3, 6.4_

### 6. Create Customer Management Pages

- [ ] 6.1 Create Customer table page
  - Create customer table page at pages/dashboard/master-data/customers/page.tsx
  - Include search, filtering, pagination, and bulk operations
  - Show customer basic info, due amounts, and action buttons
  - _Requirements: 3.4, 7.1, 7.2_

- [ ] 6.2 Create Customer view page
  - Create customer detail view page showing complete customer information
  - Display subscription history, payment history, and current due amount
  - Include navigation to edit customer and add payments/subscriptions
  - _Requirements: 3.2, 7.3_

- [ ] 6.3 Create Customer add/edit forms
  - Create customer form components for adding and editing customers
  - Include all customer fields with proper validation
  - Handle old_due field and location coordinates
  - _Requirements: 3.1, 3.3, 7.4_

- [ ] 6.4 Create Customer components folder
  - Create components folder under customers with reusable customer components
  - Include CustomerTable, CustomerForm, CustomerCard components
  - _Requirements: 7.1, 7.2, 7.4_

### 7. Create Subscription Management Pages

- [ ] 7.1 Create Subscription table page
  - Create subscription management page with list of all subscriptions
  - Include filtering by customer, package, status, and date ranges
  - Show subscription details, duration, amounts, and status
  - _Requirements: 4.3, 8.1, 8.2_

- [ ] 7.2 Create Subscription add/edit forms
  - Create subscription form for creating and editing subscriptions
  - Include package selection, add-on selection, and duration input
  - Calculate total amounts automatically based on selections
  - _Requirements: 4.1, 4.2, 8.4_

- [ ] 7.3 Create Subscription view page
  - Create detailed subscription view showing all subscription information
  - Include associated customer, package, add-ons, and payment history
  - _Requirements: 4.3, 8.2_

### 8. Create Payment Management Pages

- [ ] 8.1 Create Payment table page
  - Create payment management page with list of all payments
  - Include filtering by customer, date ranges, and payment methods
  - Show payment details and associated subscriptions
  - _Requirements: 5.2, 8.1, 8.2_

- [ ] 8.2 Create Payment add/edit forms
  - Create payment form for recording customer payments
  - Include customer selection, amount input, and payment method
  - Auto-calculate remaining due amounts
  - _Requirements: 5.1, 5.3, 8.4_

### 9. Create Services and Types for Frontend

- [ ] 9.1 Create subscription service
  - Create subscription.service.ts with API calls for subscription management
  - Include CRUD operations and filtering methods
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 9.2 Create payment service
  - Create payment.service.ts with API calls for payment management
  - Include CRUD operations and due calculation methods
  - _Requirements: 5.1, 5.2, 5.3_

- [ ] 9.3 Create TypeScript types
  - Create Subscription.ts and Payment.ts types in types folder
  - Define interfaces for API requests and responses
  - _Requirements: 4.1, 5.1_

- [ ] 9.4 Create validation schemas
  - Create subscription.schema.ts and payment.schema.ts for frontend validation
  - Use Zod for consistent validation with backend
  - _Requirements: 4.1, 5.1_

### 10. Update Routing and Navigation

- [ ] 10.1 Add customer routes to main router
  - Update main.tsx to include customer management routes
  - Add routes for customer table, view, add, and edit pages
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 10.2 Add subscription and payment routes
  - Add routes for subscription and payment management pages
  - Include nested routes for different views and forms
  - _Requirements: 8.1, 8.2_

- [ ] 10.3 Update sidebar navigation
  - Update sidebar.tsx to include links to all management pages
  - Organize navigation logically with proper icons
  - _Requirements: 8.2, 8.3_

### 11. Integration and Testing

- [ ] 11.1 Test customer management flow
  - Test complete customer CRUD operations
  - Verify due amount calculations work correctly
  - Test customer approval workflow for admin users
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ] 11.2 Test subscription management flow
  - Test subscription creation with package and add-on selection
  - Verify amount calculations and due amount updates
  - Test subscription editing and deletion
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 11.3 Test payment management flow
  - Test payment recording and due amount updates
  - Verify payment history displays correctly
  - Test payment editing and deletion
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 11.4 Test end-to-end billing workflow
  - Test complete workflow: customer creation → subscription → payments → due calculations
  - Verify all components work together seamlessly
  - Test with different user roles (Admin vs Employee)
  - _Requirements: 1.1, 1.2, 1.3, 1.4_