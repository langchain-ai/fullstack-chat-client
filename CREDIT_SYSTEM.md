# Credit Deduction System

This document explains how the credit deduction system is implemented in the fullstack chat application.

## Overview

The credit system deducts 1 credit from the user's account for every LLM request made through the chat interface. This includes:

- Sending new messages
- Regenerating AI responses
- Editing messages (which triggers a new LLM request)

## Implementation

### Core Components

1. **`deductUserCredits` function** (`src/lib/stripe.ts`)

   - Handles the actual credit deduction logic
   - Updates user's credit balance in Supabase
   - Returns success status and new balance

2. **`useCreditDeduction` hook** (`src/hooks/use-credit-deduction.ts`)

   - Centralized hook for credit deduction logic
   - Handles authentication checks
   - Provides user-friendly error messages
   - Shows toast notifications
   - **NEW**: Integrates with global credits context for real-time UI updates

3. **`CreditsProvider` context** (`src/providers/Credits.tsx`)

   - **NEW**: Global state management for credits
   - Provides optimistic updates for instant UI feedback
   - Handles credit fetching and error states
   - Enables real-time credit balance updates across the app

4. **`CreditBalance` component** (`src/components/credits/credit-balance.tsx`)

   - **NEW**: Real-time credit balance display with Badge design
   - Color-coded indicators (red/orange/green) based on credit levels
   - Automatic updates when credits are deducted
   - Loading and error states

5. **Credit integration points:**
   - `src/components/thread/index.tsx` - Main message submission and regeneration
   - `src/components/thread/messages/human.tsx` - Message editing

### How It Works

1. **Pre-request validation**: Before any LLM request is made, the system:

   - Checks if the user is authenticated
   - **NEW**: Optimistically deducts credits from UI immediately
   - Attempts to deduct credits from database
   - Only proceeds with the LLM request if credits are successfully deducted
   - **NEW**: Reverts optimistic update if deduction fails

2. **Real-time UI Updates**:

   - Credits are deducted from the UI instantly for immediate feedback
   - Database is updated in the background
   - UI is refreshed with actual balance from server
   - Failed requests automatically refund credits

3. **Error handling**: If credit deduction fails:

   - **NEW**: Automatically reverts optimistic UI updates
   - Shows appropriate error messages (insufficient credits, authentication required)
   - Prevents the LLM request from being made
   - Suggests purchasing more credits when needed

4. **Success feedback**: When credits are deducted:
   - **NEW**: UI updates immediately (optimistic)
   - Shows a success toast with remaining balance
   - Proceeds with the LLM request
   - **NEW**: Refreshes with actual balance from server

### User Experience

- **Immediate feedback**: Users see credit deduction instantly in the UI
- **Fail-fast approach**: Prevents unnecessary LLM calls when credits are insufficient
- **Clear messaging**: Descriptive error messages explain what went wrong
- **Real-time balance visibility**: Credit balance updates across all components instantly
- **Automatic error recovery**: Failed requests automatically refund credits

## Credit Balance Display

The `CreditBalance` component (`src/components/credits/credit-balance.tsx`) shows users their current credit balance with:

- **Badge design** with professional styling
- **Real-time updates** when credits are deducted/added
- **Color-coded indicators**:
  - **Red**: 0 credits (urgent)
  - **Orange**: 1-5 credits (low)
  - **Green**: 6+ credits (good)
- **Loading states** with pulse animation
- **Error handling** with fallback displays
- **Number formatting** (1,000 instead of 1000)

## Global State Management

### CreditsProvider Context

The `CreditsProvider` wraps the entire application and provides:

```typescript
interface CreditsContextProps {
  credits: number | null; // Current credit balance
  loading: boolean; // Loading state
  error: string | null; // Error state
  refreshCredits: () => Promise<void>; // Refresh from server
  updateCredits: (newCredits: number) => void; // Set exact amount
  deductCredits: (amount: number) => void; // Optimistic deduction
  addCredits: (amount: number) => void; // Optimistic addition
}
```

### Integration Pattern

Components can access and update credits using the context:

```typescript
const { credits, deductCredits, addCredits } = useCreditsContext();

// Optimistic deduction
deductCredits(1);
// Later: refresh with actual balance
refreshCredits();
```

## Database Schema

The credit system relies on the `users` table having these columns:

- `credits_available` (integer): Current credit balance
- `subscription_status` (text): User's subscription status

## Error Scenarios

1. **Insufficient Credits**: User has 0 credits remaining
2. **Authentication Required**: User is not signed in
3. **Database Errors**: Network issues or database connectivity problems
4. **Server Overload**: LangGraph server temporarily unavailable (credits auto-refunded)

## Usage Examples

### Basic credit deduction:

```typescript
const { deductCredits } = useCreditDeduction();
const result = await deductCredits({ reason: "send message" });
if (!result.success) {
  return; // Error already handled by hook
}
// Proceed with LLM request
```

### Custom credit amount:

```typescript
const result = await deductCredits({
  reason: "premium feature",
  creditsToDeduct: 5,
  showSuccessToast: false,
});
```

### Using global credit state:

```typescript
const { credits, loading, error } = useCreditsContext();

if (loading) return <Spinner />;
if (error) return <ErrorMessage />;
return <div>Credits: {credits}</div>;
```

## Integration Points

- **Message submission**: `handleSubmit` in Thread component
- **Message regeneration**: `handleRegenerate` in Thread component
- **Message editing**: `handleSubmitEdit` in HumanMessage component
- **Global credit display**: `CreditBalance` component in navbar
- **State management**: `CreditsProvider` in root layout

## Future Enhancements

1. **Variable credit costs**: Different LLM models could cost different amounts
2. **Credit packages**: Bulk credit purchases with discounts
3. **Usage analytics**: Track credit usage patterns
4. **Credit expiration**: Time-based credit expiration
5. **Subscription integration**: Automatic credit replenishment for subscribers
6. **Credit notifications**: Push notifications for low credit warnings
7. **Credit history**: Transaction log for credit usage tracking
