# orbital-studybuddy-2025

A collaborative study group management platform for Orbital 2025.

## Per-user data isolation (Supabase)

The app expects per-user scoping for study time, todos, and calendar data.

Required columns:
- `study_times.user_id` (UUID, FK → `auth.users.id`)
- `todos.user_id` (UUID, FK → `auth.users.id`)
- `todo-groups.user_id` (UUID, FK → `auth.users.id`)

Recommended RLS policies (enable RLS on each table):

```sql
-- study_times
create policy "study_times_select_own"
on study_times for select
using (auth.uid() = user_id);

create policy "study_times_insert_own"
on study_times for insert
with check (auth.uid() = user_id);

create policy "study_times_update_own"
on study_times for update
using (auth.uid() = user_id);

create policy "study_times_delete_own"
on study_times for delete
using (auth.uid() = user_id);

-- todos
create policy "todos_select_own"
on todos for select
using (auth.uid() = user_id);

create policy "todos_insert_own"
on todos for insert
with check (auth.uid() = user_id);

create policy "todos_update_own"
on todos for update
using (auth.uid() = user_id);

create policy "todos_delete_own"
on todos for delete
using (auth.uid() = user_id);

-- todo-groups
create policy "todo_groups_select_own"
on "todo-groups" for select
using (auth.uid() = user_id);

create policy "todo_groups_insert_own"
on "todo-groups" for insert
with check (auth.uid() = user_id);

create policy "todo_groups_update_own"
on "todo-groups" for update
using (auth.uid() = user_id);

create policy "todo_groups_delete_own"
on "todo-groups" for delete
using (auth.uid() = user_id);
```
