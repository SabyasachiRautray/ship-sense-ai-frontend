import React, { useState } from "react";
import {
  useCreateShipmentMutation,
  useGetAllUsersQuery,
  useGetAllPartnersQuery,
  useAssignPartnerMutation,
} from "../redux/api/shipApi";
import { X, Plus, User, Truck, CheckCircle, ChevronRight } from "lucide-react";
import Dropdown from "./Dropdown";

const CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata",
  "Pune", "Hyderabad", "Ahmedabad", "Jaipur", "Surat",
];
const CARRIERS = [
  "BlueDart", "DTDC", "FedEx", "Delhivery", "Ekart",
  "DHL", "Amazon Logistics",
];

export default function AddShipmentModal({ onClose }) {
  const [create, { isLoading: isCreating }]       = useCreateShipmentMutation();
  const [assignPartner, { isLoading: isAssigning }] = useAssignPartnerMutation();
  const { data: users, isLoading: usersLoading }    = useGetAllUsersQuery();
  const { data: partners, isLoading: partnersLoading } = useGetAllPartnersQuery();

  const [step, setStep]       = useState(1); // 1 = shipment details, 2 = assign partner
  const [error, setError]     = useState("");
  const [createdId, setCreatedId] = useState(null); // shipment_id after creation
  const [selectedPartner, setSelectedPartner] = useState("");

  const [form, setForm] = useState({
    shipment_id: "",
    origin: "Mumbai",
    destination: "Delhi",
    carrier: "BlueDart",
    eta: "",
    sla_deadline: "",
    user_id: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  // Step 1: Create shipment
  const handleCreateShipment = async () => {
    setError("");
    if (!form.shipment_id || !form.eta || !form.sla_deadline) {
      setError("Please fill all required fields");
      return;
    }
    if (!form.user_id) {
      setError("Please select a user to assign this shipment");
      return;
    }
    if (form.origin === form.destination) {
      setError("Origin and destination cannot be the same");
      return;
    }
    try {
      await create({ ...form, user_id: parseInt(form.user_id) }).unwrap();
      setCreatedId(form.shipment_id);
      setStep(2);
    } catch (err) {
      setError(err?.data?.detail || "Failed to create shipment");
    }
  };

  // Step 2: Assign partner (optional — can skip)
  const handleAssignPartner = async () => {
    if (!selectedPartner) {
      onClose();
      return;
    }
    setError("");
    try {
      await assignPartner({
        shipmentId: createdId,
        partnerId: parseInt(selectedPartner),
      }).unwrap();
      onClose();
    } catch (err) {
      setError(err?.data?.detail || "Failed to assign partner");
    }
  };

  const cityOptions    = CITIES.map((c)   => ({ name: c, value: c }));
  const carrierOptions = CARRIERS.map((c) => ({ name: c, value: c }));
  const userOptions    = users?.map((u)   => ({
    name: `${u.name} — ${u.email} (${u.user_type})`,
    value: u.id.toString(),
  })) || [];
  const partnerOptions = partners?.map((p) => ({
    name: `${p.name} — ${p.vehicle_type || p.email}`,
    value: p.id.toString(),
  })) || [];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[95vh] overflow-y-auto">

        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="font-bold text-slate-800">
              {step === 1 ? "Add New Shipment" : "Assign Delivery Partner"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {step === 1
                ? "Fill in the details and assign to a user"
                : `Shipment ${createdId} created — assign a partner`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-2 px-6 pt-4">
          {[1, 2].map((s) => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-1.5 ${s < step ? 'text-green-600' : s === step ? 'text-blue-600' : 'text-slate-300'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                  s < step  ? 'bg-green-50 border-green-400' :
                  s === step ? 'bg-blue-50 border-blue-400' :
                               'bg-slate-50 border-slate-200'
                }`}>
                  {s < step ? <CheckCircle size={12} /> : s}
                </div>
                <span className="text-xs font-medium hidden sm:inline">
                  {s === 1 ? "Shipment Details" : "Assign Partner"}
                </span>
              </div>
              {s < 2 && <ChevronRight size={14} className="text-slate-300 flex-shrink-0" />}
            </React.Fragment>
          ))}
        </div>

        <div className="p-6 space-y-4">

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <>
              {/* Shipment ID */}
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1.5">
                  Shipment ID <span className="text-red-400">*</span>
                </label>
                <input
                  name="shipment_id"
                  value={form.shipment_id}
                  onChange={handleChange}
                  placeholder="SHP-1046"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-700"
                />
              </div>

              {/* Origin + Destination */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1.5">Origin</label>
                  <Dropdown
                    options={cityOptions}
                    selectedValue={form.origin}
                    onChange={(value) => setForm({ ...form, origin: value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1.5">Destination</label>
                  <Dropdown
                    options={cityOptions}
                    selectedValue={form.destination}
                    onChange={(value) => setForm({ ...form, destination: value })}
                  />
                </div>
              </div>

              {/* Carrier */}
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1.5">Carrier</label>
                <Dropdown
                  options={carrierOptions}
                  selectedValue={form.carrier}
                  onChange={(value) => setForm({ ...form, carrier: value })}
                />
              </div>

              {/* ETA + SLA */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1.5">
                    ETA <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="eta"
                    value={form.eta}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-700"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1.5">
                    SLA Deadline <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="sla_deadline"
                    value={form.sla_deadline}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-700"
                  />
                </div>
              </div>

              {/* Assign to User */}
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1.5">
                  Assign to User <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none" />
                  <Dropdown
                    options={userOptions}
                    selectedValue={form.user_id}
                    onChange={(value) => setForm({ ...form, user_id: value })}
                    disabled={usersLoading}
                  />
                </div>
                {form.user_id && (
                  <div className="mt-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {users?.find((u) => u.id === parseInt(form.user_id))?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-700">
                        {users?.find((u) => u.id === parseInt(form.user_id))?.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {users?.find((u) => u.id === parseInt(form.user_id))?.email}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <>
              {/* Success banner */}
              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center gap-2">
                <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-green-700">Shipment created!</p>
                  <p className="text-xs text-green-600">{createdId} has been added successfully.</p>
                </div>
              </div>

              {/* Partner selector */}
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1.5">
                  Delivery Partner
                  <span className="ml-1 text-slate-400 font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <Truck size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none" />
                  <Dropdown
                    options={[{ name: "No partner — assign later", value: "" }, ...partnerOptions]}
                    selectedValue={selectedPartner}
                    onChange={(value) => { setSelectedPartner(value); setError(""); }}
                    disabled={partnersLoading}
                  />
                </div>
              </div>

              {/* Selected partner preview */}
              {selectedPartner && (
                <div className="bg-orange-50 border border-orange-100 rounded-xl px-3 py-2 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {partners?.find((p) => p.id === parseInt(selectedPartner))?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-700">
                      {partners?.find((p) => p.id === parseInt(selectedPartner))?.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {partners?.find((p) => p.id === parseInt(selectedPartner))?.vehicle_type ||
                       partners?.find((p) => p.id === parseInt(selectedPartner))?.email}
                    </p>
                  </div>
                </div>
              )}

              {partnersLoading && (
                <p className="text-xs text-slate-400 text-center py-2">Loading partners...</p>
              )}

              {!partnersLoading && partners?.length === 0 && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-center">
                  <Truck size={20} className="mx-auto mb-1 text-slate-300" />
                  <p className="text-xs text-slate-500">No delivery partners available yet.</p>
                </div>
              )}
            </>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={step === 1 ? onClose : () => setStep(1)}
              className="flex-1 border border-slate-200 text-slate-600 hover:bg-slate-50 py-2.5 rounded-xl text-sm font-medium transition-colors"
            >
              {step === 1 ? "Cancel" : "Back"}
            </button>

            <button
              onClick={step === 1 ? handleCreateShipment : handleAssignPartner}
              disabled={isCreating || isAssigning}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isCreating || isAssigning ? (
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
              ) : step === 1 ? (
                <><Plus size={16} /> Create Shipment</>
              ) : selectedPartner ? (
                <><Truck size={16} /> Assign & Finish</>
              ) : (
                "Skip & Finish"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}