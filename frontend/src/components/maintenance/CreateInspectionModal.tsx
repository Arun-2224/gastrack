import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inspectionApi } from '../../api/inspections';
import { cylinderApi } from '../../api/cylinders';
import { Modal } from '../ui/Modal';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useToast } from '../../context/ToastContext';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

interface CreateInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateInspectionModal: React.FC<CreateInspectionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [cylinderId, setCylinderId] = useState('');
  const [inspectionType, setInspectionType] = useState('POST_REFILL');
  const [leakTest, setLeakTest] = useState<'PASSED' | 'FAILED'>('PASSED');
  const [valveCondition, setValveCondition] = useState('GOOD');
  const [bodyCondition, setBodyCondition] = useState('GOOD');
  const [corrosion, setCorrosion] = useState('NONE');
  const [pressureTest, setPressureTest] = useState('PASSED');
  const [safetySeal, setSafetySeal] = useState('INTACT');
  const [overallCondition, setOverallCondition] = useState('GOOD');
  const [result, setResult] = useState<'PASSED' | 'FAILED' | 'NEEDS_MAINTENANCE' | 'REJECTED'>('PASSED');
  const [remarks, setRemarks] = useState('');

  const queryClient = useQueryClient();
  const { success, error } = useToast();

  const { data: cylindersData } = useQuery({
    queryKey: ['cylinders-for-inspection'],
    queryFn: () => cylinderApi.list({ limit: 50 }),
    enabled: isOpen,
  });

  // Auto-calculate suggested result when checks change
  const handleLeakTestChange = (val: 'PASSED' | 'FAILED') => {
    setLeakTest(val);
    if (val === 'FAILED') {
      setResult('FAILED');
      setOverallCondition('POOR');
    } else {
      setResult('PASSED');
      setOverallCondition('GOOD');
    }
  };

  const mutation = useMutation({
    mutationFn: (data: any) => inspectionApi.create(data),
    onSuccess: (res) => {
      success('Inspection Logged', `Result: ${res.inspection.result}. Cylinder updated.`);
      queryClient.invalidateQueries({ queryKey: ['inspections'] });
      queryClient.invalidateQueries({ queryKey: ['cylinders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      onClose();
    },
    onError: (err: any) => {
      error('Inspection Error', err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cylinderId) {
      error('Validation', 'Please select a cylinder to inspect.');
      return;
    }

    mutation.mutate({
      cylinderId,
      inspectionType,
      leakTest,
      valveCondition,
      bodyCondition,
      corrosion,
      pressureTest,
      safetySeal,
      overallCondition,
      result,
      remarks,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Safety Leak Inspection"
      description="Perform mandatory leak detection, hydrostatic testing, and valve safety assessment"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Cylinder under Inspection"
          value={cylinderId}
          onChange={(e) => setCylinderId(e.target.value)}
          required
        >
          <option value="">Select cylinder...</option>
          {cylindersData?.data.map((cyl) => (
            <option key={cyl._id} value={cyl._id}>
              {cyl.serialNumber} ({cyl.status} • {cyl.capacity}kg • {cyl.cylinderType.replace('_', ' ')})
            </option>
          ))}
        </Select>

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Inspection Scope"
            value={inspectionType}
            onChange={(e) => setInspectionType(e.target.value)}
            options={[
              { value: 'POST_REFILL', label: 'Post-Refill Quality Audit' },
              { value: 'ROUTINE', label: 'Routine Warehouse Intake' },
              { value: 'PERIODIC_STATUTORY', label: 'Statutory Hydrostatic Re-test' },
              { value: 'INCIDENT_CHECK', label: 'Incident / Return Triage' },
            ]}
          />

          <Select
            label="Immersion / Sniffer Leak Test"
            value={leakTest}
            onChange={(e) => handleLeakTestChange(e.target.value as any)}
            options={[
              { value: 'PASSED', label: 'PASSED (Zero Bubble / Gas Detect)' },
              { value: 'FAILED', label: 'FAILED (Gas Escape Detected)' },
            ]}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Valve Mechanical Condition"
            value={valveCondition}
            onChange={(e) => setValveCondition(e.target.value)}
            options={[
              { value: 'GOOD', label: 'GOOD - Tight O-Ring & Threads' },
              { value: 'FAIR', label: 'FAIR - Minor Wear' },
              { value: 'DEFECTIVE', label: 'DEFECTIVE - Leaking / Stripped' },
            ]}
          />

          <Select
            label="Body & Shell Integrity"
            value={bodyCondition}
            onChange={(e) => setBodyCondition(e.target.value)}
            options={[
              { value: 'GOOD', label: 'GOOD - Intact' },
              { value: 'DENTED', label: 'DENTED - Shell Deformation' },
              { value: 'CORRODED', label: 'CORRODED - Surface Rust' },
              { value: 'DAMAGED', label: 'DAMAGED - Critical Pitting' },
            ]}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Pressure Rating Test"
            value={pressureTest}
            onChange={(e) => setPressureTest(e.target.value)}
            options={[
              { value: 'PASSED', label: 'PASSED (Nominal Bar Hold)' },
              { value: 'FAILED', label: 'FAILED (Pressure Drop)' },
              { value: 'NOT_APPLICABLE', label: 'Not Applicable' },
            ]}
          />

          <Select
            label="Safety Tamper Seal"
            value={safetySeal}
            onChange={(e) => setSafetySeal(e.target.value)}
            options={[
              { value: 'INTACT', label: 'INTACT (Factory Sealed)' },
              { value: 'BROKEN', label: 'BROKEN (Tampered)' },
              { value: 'MISSING', label: 'MISSING' },
            ]}
          />
        </div>

        {/* Final Decision */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-400" /> Overall Inspection Verdict
          </label>
          <Select
            value={result}
            onChange={(e) => setResult(e.target.value as any)}
            options={[
              { value: 'PASSED', label: 'PASSED -> Move cylinder to AVAILABLE' },
              { value: 'NEEDS_MAINTENANCE', label: 'NEEDS_MAINTENANCE -> Move cylinder to MAINTENANCE' },
              { value: 'FAILED', label: 'FAILED -> Move cylinder to DAMAGED' },
              { value: 'REJECTED', label: 'REJECTED -> Decommission to RETIRED' },
            ]}
          />
          <p className="text-[11px] text-slate-400">
            Note: System automatically transitions cylinder lifecycle state and writes immutable audit logs.
          </p>
        </div>

        <Input
          label="Inspector Remarks"
          placeholder="e.g. Tested at 25 bar hydrostatic pressure, 0 ppm hydrocarbon leakage"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={mutation.isPending}>
            Log Official Inspection
          </Button>
        </div>
      </form>
    </Modal>
  );
};
