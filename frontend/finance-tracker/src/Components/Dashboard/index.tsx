import { Tabs } from "flowbite-react";

import { Expenses } from '../Expenses'

export function Dashboard() {
    return (
        <Tabs aria-label="Default tabs" variant="default">
          <Tabs.Item active title="Expenses">
            <Expenses />
          </Tabs.Item>
          <Tabs.Item active title="Budgets">
            <h1>Budgets</h1>
          </Tabs.Item>
        </Tabs>
      );
}
