# Backend Integration Updates

## Changes Made

The frontend has been updated to work with the new RAG backend API that requires a `user_id` and returns enhanced response data including session information and routing decisions.

### Key Changes:

#### 1. User ID Management
- **Added persistent user ID generation** in `useSessionManager.js`
- **User ID is stored in localStorage** and persists across browser sessions
- **Generated once per browser** and reused for all subsequent requests
- **Format**: `user_TIMESTAMP_RANDOMSTRING`

#### 2. API Request Updates
- **RAG requests now include**:
  - `query`: The user's message
  - `user_id`: Persistent user identifier
  - `extra_inputs`: Object for additional inputs (extensible)

#### 3. Response Handling
- **New response structure handled**:
  - `answer`: Direct string answer or object with message content
  - `session_info`: Backend session information
  - `routing_decision`: How the query was routed ('vectorstore', 'web_search', etc.)
  - `documents_used`: Number of documents used in response

#### 4. Enhanced Debugging
- **Console logging** for routing decisions and document usage
- **Fallback handling** for missing answers
- **Better error messages** for API failures

### Updated Files:

1. **`src/hooks/useSessionManager.js`**
   - Added `generateUserId()` function
   - Added `getUserId()` method to hook return

2. **`src/components/StatefulChats.js`**
   - Pass `getUserId` prop to ChatInterface components

3. **`src/App.js`**
   - Extract `getUserId` from session manager
   - Pass to chat components

4. **`src/components/ChatInterface.js`**
   - Accept `getUserId` prop
   - Updated RAG API request payload
   - Enhanced response parsing
   - Added debug logging
   - Fixed ESLint warning with useMemo

5. **`src/utils.js`**
   - Updated `formatRagResponseForChat` to handle new response format
   - Support both string and object answer types

### API Request Format (Before vs After):

**Before:**
```javascript
{
  "query": "What is the revenue of Apple?"
}
```

**After:**
```javascript
{
  "query": "What is the revenue of Apple?",
  "user_id": "user_1735517123456_abc123def",
  "extra_inputs": {}
}
```

### Response Format Handling:

The frontend now properly handles responses like:
```javascript
{
  "answer": "Apple's revenue for Q4 2023 was $119.6 billion...",
  "session_info": {
    "session_id": "session_123",
    "message_count": 5
  },
  "documents_used": 3,
  "routing_decision": "vectorstore_with_web_supplement"
}
```

### Testing:

1. **User ID Generation**: Check browser localStorage for persistent `user_id`
2. **API Requests**: Monitor network tab to verify `user_id` is included
3. **Response Handling**: Check console for routing decision logs
4. **Session Awareness**: Backend can now track user conversations

### Benefits:

- **Session Memory**: Backend can maintain conversation context per user
- **Improved Routing**: Visibility into how queries are processed
- **Better Analytics**: Track user engagement and query patterns
- **Enhanced Debugging**: Clear logging of API interactions
- **Future-Ready**: Extensible structure for additional features

The frontend now fully supports the enhanced RAG backend while maintaining backward compatibility with existing session management and UI features.