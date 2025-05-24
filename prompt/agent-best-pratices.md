# AGENT BEST PRACTICES - Vue.js Docker Development

## CRITICAL DECISION MAKING HIERARCHY

### 1. ALWAYS TRY FIRST - Agent Capabilities
**YOU MUST ATTEMPT THESE ACTIONS BEFORE REQUESTING DEVELOPER HELP:**

- **File Creation/Editing**: Try to create/edit Vue components, TypeScript files, and configurations
- **Directory Creation**: Try creating folders for components, composables, stores, and services
- **Code Writing**: Write complete Vue 3 components, composables, and TypeScript classes
- **Package Management**: Add dependencies and modify package.json
- **Build Configuration**: Modify vite.config.ts, tsconfig.json, and environment files

### 2. PREFER VUE 3 + VITE COMMANDS - Framework First Approach
**WHEN POSSIBLE, USE VUE/VITE COMMANDS OVER MANUAL CREATION:**

```bash
# PREFERRED: Use Vue 3 + Vite commands
npm create vue@latest project-name
npm install package-name
npm run build
npm run dev
npm run type-check
npm run lint

# DOCKER PREFERRED: Execute through container
docker compose exec vue-app npm install package-name
docker compose exec vue-app npm run build
docker compose exec vue-app npm run type-check

# FALLBACK: Only use manual creation if npm commands fail
mkdir src/components/NewFeature
touch src/components/NewFeature/Component.vue
```

### 3. DOCKER COMMAND EXECUTION
**ALWAYS ATTEMPT DOCKER COMMANDS DIRECTLY:**

```bash
# TRY THESE FIRST
docker compose exec vue-app npm install
docker compose exec vue-app npm run build  
docker compose exec vue-app npm run type-check
docker compose exec vue-app npm run lint
docker compose ps
docker compose logs vue-app
docker compose up --build
```

### 4. ONLY REQUEST HELP WHEN EXPLICITLY BLOCKED
**REQUEST DEVELOPER ACTION ONLY WHEN YOU RECEIVE EXPLICIT ERROR MESSAGES:**

- ✅ "Permission denied"
- ✅ "Cannot edit file in .gitignore" 
- ✅ "Access denied to container"
- ✅ "Command not found"
- ✅ "File is read-only"
- ✅ "EACCES: permission denied"
- ✅ "Module not found" (after install attempts)

**DO NOT REQUEST HELP FOR:**
- ❌ Components you haven't tried to create
- ❌ Dependencies you haven't attempted to install
- ❌ Directories you haven't tried to create
- ❌ Standard Vue.js operations
- ❌ Build errors you haven't attempted to resolve

## TECHNOLOGY STACK GUIDELINES

### Core Technologies Detected
1. **Vue 3.5.13** - Composition API with TypeScript
2. **TypeScript 5.8** - Strict mode enabled
3. **Vite 6.2.4** - Build tool and dev server
4. **Pinia 3.0.1** - State management
5. **Vue Router 4.5.0** - Routing
6. **Docker** - Containerized development
7. **Sass** - CSS preprocessing (when needed)
8. **Vitest** - Unit testing
9. **ESLint + Prettier** - Code quality

### Framework Knowledge (Vue 3 + TypeScript + Vite)
**USE VUE 3 CONVENTIONS AND MODERN FEATURES:**

- **Composition API**: Use `<script setup>` syntax primarily
- **TypeScript**: Use proper typing with interfaces and types  
- **Reactive References**: Use `ref()`, `reactive()`, `computed()`
- **Lifecycle Hooks**: Use `onMounted()`, `onUnmounted()`, etc.
- **Component Structure**: Use Single File Components (.vue)
- **State Management**: Use Pinia for global state
- **Routing**: Use Vue Router 4 with TypeScript
- **Build Tool**: Use Vite for development and building

### Directory Structure (Vue 3 + TypeScript)
**FOLLOW STANDARD VUE 3 PROJECT CONVENTIONS:**

```
src/
├── components/
│   ├── ui/
│   ├── layout/
│   └── features/
├── composables/
├── stores/
├── services/
├── types/
├── utils/
├── views/
├── router/
├── assets/
└── styles/
```

### Package Management Priority
**ALWAYS PREFER NPM COMMANDS OVER MANUAL EDITING:**

```bash
# CORRECT APPROACH
1. Try: docker compose exec vue-app npm install @vueuse/core
2. Try: docker compose exec vue-app npm install -D @types/node
3. If fails: Then manually edit package.json

# WRONG APPROACH  
1. Immediately ask developer to run npm install
2. Edit package.json without trying npm commands first
```

## COMMON PITFALLS AND SOLUTIONS

### 1. Sass/SCSS Setup
**PREVENT IMPORT ERRORS:**

```scss
// CORRECT: Create variables file first
// src/styles/variables/_colors.scss
$primary: #2c3e50;
$secondary: #3498db;

// CORRECT: Import in component
<style scoped lang="scss">
@import '@/styles/variables/colors';
.component { color: $primary; }
</style>

// WRONG: Import non-existent files
@import '@/styles/all-variables'; // File doesn't exist!
```

### 2. TypeScript Props and Types
**ALWAYS TYPE COMPONENTS PROPERLY:**

```vue
<!-- CORRECT -->
<script setup lang="ts">
interface Props {
  title: string
  count?: number
  items: string[]
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
  items: () => []
})
</script>

<!-- WRONG -->
<script setup>
// No TypeScript, no types!
const props = defineProps(['title', 'count'])
</script>
```

### 3. Import Paths
**USE CONSISTENT IMPORT PATTERNS:**

```typescript
// CORRECT - Use @ alias
import { useUser } from '@/composables/useUser'
import type { User } from '@/types/user'

// WRONG - Relative paths in deep components
import { useUser } from '../../../composables/useUser'
```

## INCREMENTAL DEVELOPMENT APPROACH

### Step 1: Always Verify Current State
```bash
docker compose exec vue-app npm run dev
docker compose exec vue-app npm run type-check
# Check for existing errors before adding new code
```

### Step 2: Create Minimal Working Version
```vue
<!-- Start with basic structure -->
<template>
  <div class="component-name">
    <h1>{{ title }}</h1>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
}
const props = defineProps<Props>()
</script>

<style scoped>
.component-name {
  padding: 1rem;
}
</style>
```

### Step 3: Add Features Incrementally
- Add one feature
- Test it works
- Run type-check
- Add next feature

### Step 4: Style Last
- Functionality first
- Basic CSS next  
- Sass variables last
- Responsive design as final step

## VALIDATION COMMANDS

### After EVERY Change
```bash
# Quick validation
docker compose exec vue-app npm run type-check

# Before committing conceptually
docker compose exec vue-app npm run lint
docker compose exec vue-app npm run build
```

### When Adding Dependencies
```bash
# Install
docker compose exec vue-app npm install package-name

# Verify installation
docker compose exec vue-app npm list package-name

# Check for type definitions
docker compose exec vue-app npm install -D @types/package-name
```

## ERROR RECOVERY STRATEGIES

### TypeScript Errors
```typescript
// ERROR: Property 'value' does not exist
// SOLUTION: Check if using .value on refs correctly
const count = ref(0)
console.log(count.value) // Correct
console.log(count) // Wrong in script

// ERROR: Type 'string' is not assignable to type 'number'
// SOLUTION: Fix the type
const count = ref<number>(0)
count.value = 5 // Correct
count.value = "5" // Wrong
```

### Import Errors
```bash
# ERROR: Module not found
# SOLUTION: Check file exists
docker compose exec vue-app ls -la src/components/

# If file exists, check import path
# Change from: import Component from '@/components/Component'
# To: import Component from '@/components/Component.vue'
```

### Sass Errors
```scss
// ERROR: Undefined variable $primary
// SOLUTION: Import variables first
@import '@/styles/variables/colors';

// ERROR: Can't find stylesheet to import
// SOLUTION: Check path and file extension
// Wrong: @import '@/styles/variables';
// Correct: @import '@/styles/variables/colors';
```

## BEST PRACTICES SUMMARY

### 1. Small Commits (Conceptually)
- One feature per "commit"
- Test before moving forward
- Document what changed

### 2. Component Creation Order
1. Template structure
2. Script with types
3. Basic styles
4. Props and emits
5. Composables
6. Advanced styling

### 3. State Management
```typescript
// LOCAL STATE: Use refs
const isOpen = ref(false)

// COMPONENT STATE: Use reactive for objects
const state = reactive({
  user: null,
  loading: false
})

// GLOBAL STATE: Use Pinia
const userStore = useUserStore()
```

### 4. Performance Considerations
- Use `v-show` for frequent toggles
- Use `v-if` for conditional rendering
- Use `computed` for derived state
- Use `shallowRef` for large objects
- Lazy load routes and components

## DOCKER-SPECIFIC RULES

### ALWAYS Execute in Container
```bash
# CORRECT
docker compose exec vue-app npm install
docker compose exec vue-app npm run dev

# WRONG
npm install  # This runs on host!
```

### File Operations
```bash
# Create directories
docker compose exec vue-app mkdir -p src/components/features

# Check file existence
docker compose exec vue-app ls -la src/

# Read file content
docker compose exec vue-app cat package.json
```

### Container Management
```bash
# Restart after config changes
docker compose restart vue-app

# Rebuild if Dockerfile changed
docker compose up --build vue-app

# Check logs for errors
docker compose logs -f vue-app
```

## FINAL CHECKLIST

Before considering any task complete:

- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No linting errors (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Component renders without console errors
- [ ] Props are properly typed
- [ ] Imports use @ alias
- [ ] Styles are scoped
- [ ] Code follows Vue 3 Composition API patterns
- [ ] All commands were run inside Docker container

## WHEN STUCK

1. **Stop and assess**: List what you've tried
2. **Check basics**: Is the dev server running? Any console errors?
3. **Simplify**: Remove the last change and try a simpler approach
4. **Validate**: Run type-check and lint
5. **Research**: The error message usually tells you exactly what's wrong
6. **Ask specific questions**: "I get error X when doing Y" not "it doesn't work"

Remember: The goal is working, maintainable code, not perfection. Start simple, iterate, and validate frequently.