export interface IRepeater {
  Frequency: number;
  Offset: number;
  Tone: string | number;
  Call: string;
  Location: string;
  "ST/PR": string;
  Use: string;
  VOIP: string;
  Mi: number;
  Dir: string;
  Downlink: number;
  Uplink: number;
  "D-STAR Enabled"?: string;
  Node?: string;
  Sources?: string;
  County: string;
  "Op Status"?: string;
  "Last update": string;
  "Uplink Tone"?: number | string;
  "Downlink Tone"?: number | string;
  EchoLink?: number;
  IRLP?: number;
  Coordination?: string;
  "On-air"?: string;
  Sponsor?: string;
  Features?: string | number;
  Coverage?: string | number;
  AllStar?: number;
  Affiliate?: string;
  Links?: string | number;
  Commands?: string | number;
  Notes?: string | number;
  Nets?: string | number;
  "Web links"?: string;
  "DMR Enabled"?: string;
  "Color Code"?: number | string;
  "Wide Network"?: string;
  Grid?: string;
  "Location Photo"?: string;
  Talkgroups?: string;
  Colorado?: number;
  "Southern Colorado"?: number;
  "Talkgroup Network"?: string;
  "Denver Regional"?: number;
  "Northern Colorado"?: number;
  Worldwide?: number;
  "North America"?: number;
  English?: number;
  Europe?: number;
  "TAC 310"?: number;
  "DCI Bridge"?: number;
  "Southwest USA"?: number;
  Feed?: string;
  "P25 Digital Enabled"?: string;
  NAC?: number;
  "Default Reflector"?: string;
  "Mixed-Mode"?: string;
  "Local/Cluster"?: number;
  "Mountain Reg USA"?: number;
  Data?: number;
  "DMRX 1"?: number;
  "Utah Statewide 2"?: number;
  "TAC 311"?: number;
  USA?: number;
  Utah?: number;
  "PA (PA-525)"?: number;
  "Hytera USA"?: number;
  SNARS?: number;
  Parrott?: number;
  "Audio Test"?: number;
  "All TGs Off"?: number;
  "All TGs On"?: number;
  "YSF Digital Enabled"?: string;
  "DG-ID"?: string;
  "Local Network"?: string;
  "RX Location"?: string;
  Gunbarrel?: string;
  Lousville?: string;
  Lyons?: string;
  "Louisville #2"?: string;
  Local?: number;
  Wyoming?: number;
  WyLOCAL?: number;
  "WIRES-X"?: number;
  "Worldwide English"?: number;
  "N. Colorado"?: number;
  Comment?: string;
  Name?: string;
}
