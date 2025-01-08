import { Tabs } from "flowbite-react";

import { Budgets } from "../Budgets";
import { Expenses } from '../Expenses'

export function Dashboard() {
    return (
        <Tabs aria-label="Default tabs" variant="default">
          <Tabs.Item active title="Expenses">
            <Expenses />
          </Tabs.Item>
          <Tabs.Item active title="Budgets">
            <Budgets />
          </Tabs.Item>
        </Tabs>
      );
}
