
import { createClient } from '@supabase/supabase-js';

// Use environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Missing Supabase environment variables');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- Database Operations ---

// 1. Create Travel
export async function dbCreateTravel(travelData, participants) {
    // 1. Insert Travel
    const { data: travel, error: travelError } = await supabase
        .from('travels')
        .insert([travelData])
        .select()
        .single();

    if (travelError) throw travelError;

    // 2. Insert Participants
    const participantsData = participants.map(name => ({
        travel_id: travel.id,
        name: name
    }));

    const { error: partError } = await supabase
        .from('participants')
        .insert(participantsData);

    if (partError) throw partError;

    return travel;
}

// 2. Fetch Travel Data (Travel + Participants + Expenses)
export async function dbFetchTravel(travelId) {
    // Get Travel Info
    const { data: travel, error: tError } = await supabase
        .from('travels')
        .select('*')
        .eq('id', travelId)
        .single();

    if (tError) throw tError;

    // Get Participants
    const { data: participants, error: pError } = await supabase
        .from('participants')
        .select('*')
        .eq('travel_id', travelId);

    if (pError) throw pError;

    // Get Expenses with ExpenseParticipants
    const { data: expenses, error: eError } = await supabase
        .from('expenses')
        .select(`
            *,
            expense_participants (
                participant_id
            )
        `)
        .eq('travel_id', travelId)
        .order('date', { ascending: false });

    if (eError) throw eError;

    return { travel, participants, expenses };
}

// 3. Add Expense
export async function dbAddExpense(expenseData, participantIds) {
    // 1. Insert Expense
    const { data: expense, error: eError } = await supabase
        .from('expenses')
        .insert([expenseData])
        .select()
        .single();

    if (eError) throw eError;

    // 2. Insert Junction Records
    const junctionData = participantIds.map(pid => ({
        expense_id: expense.id,
        participant_id: pid
    }));

    const { error: jError } = await supabase
        .from('expense_participants')
        .insert(junctionData);

    if (jError) throw jError;

    return expense;
}

// 4. Delete Expense
export async function dbDeleteExpense(expenseId) {
    const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', expenseId);

    if (error) throw error;
    return true;
}
