# Pages

Any component that is directly routeable is considered a page.
Pages are to be placed in the `pages` directory with a patch matching their URL.
The name of the page component should end in `Page`.

## Constraints

1. It should take minimal effort to figure out where to add a new page component, and what to call if for a given user-centric URL.
2. It should be easy to add page variations. e.g. edit vs. non-edit
3. Route names must be unique.
4. It should be easy to find a component given the vue-router route name.
5. It should be easy to find the page component for a given URL.

## Directory Structure

For example

```bash
src/
├── pages/
│   ├── my-travel-requests/
│   │   ├── MyTravelRequestsPage.vue           # /my-travel-requests
|   ├── travel-requests/
│   │   ├── TravelRequestPage.vue            # /travel-requests/:travelRequestIdOrSlug
│   │   ├── details/
│   │   │   ├── DetailsPage.vue                # /my-travel-requests/:travelRequestIdOrSlug/details
│   │   │   ├── DetailsEditPage.vue            # /my-travel-requests/:travelRequestIdOrSlug/details/edit
│   │   ├── estimate/
│   │   │   ├── EstimatePage.vue               # /my-travel-requests/:travelRequestIdOrSlug/estimate
│   │   │   ├── EstimateEditPage.vue           # /my-travel-requests/:travelRequestIdOrSlug/estimate/edit
│   │   ├── expense/
│   │   │   ├── ExpensePage.vue                # /my-travel-requests/:travelRequestIdOrSlug/expense
│   │   │   ├── ExpenseEditPage.vue            # /my-travel-requests/:travelRequestIdOrSlug/expense/edit
│   │   ├── request/
│   │   │   ├── RequestPage.vue                # /my-travel-requests/:travelRequestIdOrSlug/request
│   │   │   ├── RequestEditPage.vue            # /my-travel-requests/:travelRequestIdOrSlug/request/edit
```

## Routes

For example

```ts
const routes = [
  {
    path: "/my-travel-requests",
    component: () => import("@/pages/my-travel-requests/MyTravelRequestsPage.vue"),
    name: "my-travel-requests/MyTravelRequestsPage",
  },
  {
    path: "/travel-requests/:travelRequestIdOrSlug",
    component: () => import("@/pages/travel-requests/TravelRequestPage.vue"),
    children: [
      {
        path: "details",
        component: () => import("@/pages/travel-requests/details/DetailsPage.vue"),
        name: "travel-requests/details/DetailsPage",
      },
      {
        path: "details/edit",
        component: () => import("@/pages/travel-requests/details/DetailsEditPage.vue"),
        name: "travel-requests/details/DetailsEditPage",
      },
      {
        path: "estimate",
        component: () => import("@/pages/travel-requests/estimate/EstimatePage.vue"),
        name: "travel-requests/estimate/EstimatePage",
      },
      {
        path: "estimate/edit",
        component: () => import("@/pages/travel-requests/estimate/EstimateEditPage.vue"),
        name: "travel-requests/estimate/EstimateEditPage",
      },
      {
        path: "expense",
        component: () => import("@/pages/travel-requests/expense/ExpensePage.vue"),
        name: "travel-requests/expense/ExpensePage",
      },
      {
        path: "expense/edit",
        component: () => import("@/pages/travel-requests/expense/ExpenseEditPage.vue"),
        name: "travel-requests/expense/ExpenseEditPage",
      },
      {
        path: "request",
        component: () => import("@/pages/travel-requests/request/RequestPage.vue"),
        name: "travel-requests/request/RequestPage",
      },
      {
        path: "request/edit",
        component: () => import("@/pages/travel-requests/request/RequestEditPage.vue"),
        name: "travel-requests/request/RequestEditPage",
      },
    ],
  },
]
```
