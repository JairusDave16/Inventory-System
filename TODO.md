# System-Wide Improvements TODO

## 1. Install Additional Packages
- [x] Install socket.io, socket.io-client, redis, express-rate-limit, papaparse

## 2. Theme Management
- [x] Create theme context and provider for dark mode with localStorage persistence
- [x] Add dark mode styles to CSS
- [x] Add theme toggle to Navbar

## 3. Responsive Design
- [ ] Implement responsive breakpoints in components (Layout, ItemList, RequestList)

## 4. Notifications Enhancement
- [ ] Enhance toast notifications integration throughout the app

## 5. Pagination Implementation
- [x] Add pagination to ItemList (backend: page/limit params, frontend: pagination UI)
- [x] Add pagination to RequestList (backend: page/limit params, frontend: pagination UI)

## 6. Bulk Operations
- [ ] Implement bulk approve/reject for RequestList with confirmation dialogs
- [ ] Add bulk operations to ItemList if needed

## 7. CSV Export
- [ ] Add CSV export buttons to ItemList table
- [ ] Add CSV export buttons to RequestList table

## 8. WebSocket Setup
- [ ] Set up WebSocket server in backend
- [ ] Set up WebSocket client in frontend for real-time updates

## 9. Redis Caching
- [ ] Add Redis caching layer for performance

## 10. Database Indexes
- [ ] Implement database indexes in Prisma schema

## 11. API Rate Limiting
- [ ] Add API rate limiting middleware

## 12. Testing
- [ ] Test features across different screen sizes
- [ ] Verify real-time updates work correctly
- [ ] Performance test with caching enabled
