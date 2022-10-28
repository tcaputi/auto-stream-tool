import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";

interface DropdownProps<T> {
  label: string;
  options: T[];
  displayValue: { (obj: T): string };
  displayKey: { (obj: T): string | number };
  value: T;
  onChange: { (value: T): void };
}

function Dropdown<T>(props: DropdownProps<T>) {
  return (
    <Listbox as="div" value={props.value} onChange={props.onChange}>
      <Listbox.Label className="block text-sm font-medium text-gray-200">
        {props.label}
      </Listbox.Label>
      <Listbox.Button className="flex w-full cursor-default justify-between rounded-md border border-gray-300 bg-white py-2 pl-3 pr-2 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
        <span className="flex items-center">
          <span className="block truncate">
            {props.displayValue(props.value)}
          </span>
        </span>
        <span className="pointer-events-none ml-3 flex items-center">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </span>
      </Listbox.Button>
      <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Listbox.Options className="absolute max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {props.options.map((option, i) => (
            <Listbox.Option
              className="ui-active:bg-blue-500 ui-active:text-white ui-not-active:bg-white ui-not-active:text-black"
              key={i}
              value={option}
            >
              <div className="p-2">{props.displayValue(option)}</div>
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Transition>
    </Listbox>
  );
}

export default Dropdown;
