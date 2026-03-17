/* eslint-disable no-unused-vars */
import React, { Fragment } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { HiCheck, HiChevronUpDown } from "react-icons/hi2";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Dropdown({
  options,
  selectedValue,
  onChange,
  label,
  disabled = false,
}) {
  const selectedOption =
    options.find((option) => option.value === selectedValue) || options[0];

  return (
    <Listbox value={selectedValue} onChange={onChange} disabled={disabled}>
      {({ open }) => (
        <div className="relative">
          <ListboxButton
            className={`
              relative w-full
              px-4 py-2.5
              bg-white border border-gray-200 rounded-lg
              text-left text-sm text-gray-800
              cursor-pointer
              shadow-sm
              hover:border-blue-300 hover:shadow-md
              focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
              disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed disabled:opacity-60
              transition-all duration-200
            `}
          >
            <span className="block truncate font-medium">
              {selectedOption?.name || "Select..."}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <HiChevronUpDown
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </ListboxButton>

          <Transition
            show={open}
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxOptions
              className="
                absolute z-50 mt-2 w-full
                max-h-60 overflow-auto
                bg-white
                border border-gray-200 rounded-lg
                shadow-lg
                py-1
                focus:outline-none
                scrollbar-thin scrollbar-thumb-blue-500/50 scrollbar-track-gray-100
              "
            >
              {options.map((option) => (
                <ListboxOption
                  key={option.value}
                  className={({ active }) =>
                    classNames(
                      "relative cursor-pointer select-none py-2.5 pl-10 pr-4 text-sm transition-colors duration-150",
                      active ? "bg-blue-50 text-blue-900" : "text-gray-800",
                    )
                  }
                  value={option.value}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={classNames(
                          "block truncate",
                          selected ? "font-semibold" : "font-medium",
                        )}
                      >
                        {option.name}
                      </span>

                      {selected && (
                        <span
                          className={classNames(
                            "absolute inset-y-0 left-0 flex items-center pl-3",
                            active ? "text-blue-600" : "text-blue-600",
                          )}
                        >
                          <HiCheck className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Transition>

          {/* Custom Scrollbar Styles */}
          <style>{`
            .scrollbar-thin::-webkit-scrollbar {
              width: 6px;
            }
            .scrollbar-track-gray-100::-webkit-scrollbar-track {
              background: #f3f4f6;
              border-radius: 3px;
            }
            .scrollbar-thumb-blue-500\\/50::-webkit-scrollbar-thumb {
              background: rgba(59, 130, 246, 0.5);
              border-radius: 3px;
            }
            .scrollbar-thumb-blue-500\\/50::-webkit-scrollbar-thumb:hover {
              background: rgba(59, 130, 246, 0.7);
            }
          `}</style>
        </div>
      )}
    </Listbox>
  );
}
