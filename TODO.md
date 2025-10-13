# User Experience Enhancements TODO

## 1. Backend Changes
- [x] Add bulkDeleteItems endpoint in backend/src/controllers/itemController.ts
- [x] Add bulkApproveRequests and bulkRejectRequests endpoints in backend/src/controllers/requestController.ts
- [x] Update backend/src/routes/items.ts to include bulk delete route
- [x] Update backend/src/routes/requestRoutes.ts to include bulk approve/reject routes

## 2. Frontend API Updates
- [x] Update frontend/src/api/items.ts to add bulkDeleteItems function
- [x] Update frontend/src/api/requests.ts to add bulkApproveRequests and bulkRejectRequests functions

## 3. Search and Filtering
- [ ] Add global search input to ItemList.tsx (search by name/category) with debouncing
- [ ] Add global search input to RequestList.tsx (search by item name/user/status) with debouncing
- [ ] Implement search logic in both components

## 4. Bulk Operations
- [ ] Add checkboxes to ItemList.tsx for multi-select items
- [ ] Add checkboxes to RequestList.tsx for multi-select requests
- [ ] Add bulk delete button for selected items in ItemList.tsx
- [ ] Add bulk approve/reject buttons for selected requests in RequestList.tsx
- [ ] Implement bulk operation handlers with confirmation dialogs

## 5. Responsive Design
- [ ] Update Layout.tsx to collapsible sidebar with hamburger menu for mobile
- [ ] Make tables scrollable on small screens in ItemList.tsx and RequestList.tsx
- [ ] Adjust Navbar.tsx for mobile responsiveness

## 6. Notifications
- [x] Install react-hot-toast in frontend
- [ ] Add toast notifications for successful operations (create, delete, approve, etc.)
- [ ] Add low stock alerts in ItemList.tsx

## 7. Optional: Dark Mode Toggle
- [ ] Add dark mode toggle to Navbar.tsx
- [ ] Update index.css with dark mode classes

## Testing and Followup
- [ ] Test bulk operations functionality
- [ ] Test search and filtering
- [ ] Test responsive layout on different screen sizes
- [ ] Test notifications
- [ ] Verify backend endpoints work correctly
