"use client";

import React, { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { SearchInput } from '../components/SearchInput';
import { FilterPanel } from '../components/FilterPanel';
import { CustomerRow, Customer } from '../components/CustomerRow';
import { Download, ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

// Dummy data
const initialCustomers: Customer[] = [
  { id: '1', name: 'Acme Corp', email: 'admin@acme.com', plan: 'Enterprise', status: 'Active', joinedDate: 'Jan 12, 2024' },
  { id: '2', name: 'Jane Doe', email: 'jane@gmail.com', plan: 'Pro', status: 'Active', joinedDate: 'Feb 15, 2024' },
  { id: '3', name: 'John Smith', email: 'john@smith.com', plan: 'Free', status: 'Inactive', joinedDate: 'Mar 01, 2024' },
  { id: '4', name: 'Stark Ind', email: 'tony@stark.com', plan: 'Enterprise', status: 'Active', joinedDate: 'Mar 10, 2024' },
  { id: '5', name: 'Wayne Ent', email: 'bruce@wayne.com', plan: 'Pro', status: 'Churned', joinedDate: 'Jan 05, 2024' },
  { id: '6', name: 'Cyberdyne', email: 'skynet@cyberdyne.net', plan: 'Enterprise', status: 'Active', joinedDate: 'Apr 02, 2024' },
];

const ITEMS_PER_PAGE = 5;

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter logic
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredCustomers.length);

  return (
    <div className="space-y-6 animate-fade-in h-full flex flex-col">
      <PageHeader
        title="Customers"
        actions={
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors duration-150">
            <Download className="-ml-1 mr-2 h-4 w-4 text-gray-500" aria-hidden="true" />
            Export CSV
          </button>
        }
      />

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Failed to load customers</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg border border-gray-200 flex flex-col flex-1 min-h-0">
        <FilterPanel className="border-b border-gray-200 bg-gray-50/50">
          <div className="flex-1 max-w-sm">
            <SearchInput
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              onClear={() => { setSearchQuery(''); setCurrentPage(1); }}
            />
          </div>
          <div className="flex items-center space-x-2">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-black focus:border-black sm:text-sm rounded-md bg-white border shadow-sm"
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Churned">Churned</option>
            </select>
          </div>
        </FilterPanel>

        <div className="overflow-x-auto flex-1">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name / Email
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th scope="col" className="relative px-4 py-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {loading ? (
                // Loading Skeletons
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                       <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                       <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </td>
                     <td className="px-4 py-4 whitespace-nowrap">
                       <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </td>
                    <td></td>
                  </tr>
                ))
              ) : filteredCustomers.length > 0 ? (
                paginatedCustomers.map((customer) => (
                  <CustomerRow key={customer.id} customer={customer} />
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <p className="text-sm">No customers found matching your criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{filteredCustomers.length > 0 ? startIndex + 1 : 0}</span> to <span className="font-medium">{endIndex}</span> of <span className="font-medium">{filteredCustomers.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={clsx(
                    "relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-black focus:border-black",
                    currentPage === 1 && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={clsx(
                      "relative inline-flex items-center px-4 py-2 border text-sm font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-black focus:border-black",
                      currentPage === i + 1
                        ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={clsx(
                    "relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-black focus:border-black",
                    (currentPage === totalPages || totalPages === 0) && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
