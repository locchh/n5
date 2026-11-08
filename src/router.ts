// router.ts maps each URL to a page: home, a lesson, an activity, and the mixed test
import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './pages/HomePage.vue'
import LessonPage from './pages/LessonPage.vue'
import ActivityPage from './pages/ActivityPage.vue'
import TestPage from './pages/TestPage.vue'

export const router = createRouter({
  // Real addresses like /lesson/4 (no #). Vercel needs a rewrite to index.html for this to work on reload.
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomePage },
    { path: '/lesson/:id', component: LessonPage, props: true }, // :id = lesson number, e.g. /lesson/4
    { path: '/lesson/:id/:activity', component: ActivityPage, props: true }, // :activity = an id from activities.ts, e.g. vocab
    { path: '/test', component: TestPage }, // mixed test: ~10 questions from all lessons
    // Any other URL (a typo, an old link) goes back home instead of showing a blank page
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],

  // Always start a new page at the top, instead of where the last page was scrolled to
  scrollBehavior: () => ({ top: 0 }),
})
