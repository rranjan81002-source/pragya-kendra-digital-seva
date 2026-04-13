import { createClient } from '@insforge/sdk';

const insforge = createClient({
  baseUrl: 'https://4dqqxy6r.us-east.insforge.app',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3MzI1MzR9.LIH0mmB43tpKGfNZFQcs7Zz-Ax0a2ciuBEUogefG_Z4'
});

export default insforge;
