// Concept map for Port Palace. Presentation lives in index.html.
// A playable concept can appear in more than one room. Later chains are data only.

const CONCEPTS = {
  hostname: {
    id: "hostname",
    name: "Hostname",
    category: "naming",
    playable: true,
    plain: "A name people use for a machine, such as vault.corp.",
    technical: "Applications often start from a name. The name is not an address, a route, or a connection.",
    problem: "People remember names. The network forwards toward addresses.",
    inputs: ["a name a person typed"],
    outputs: ["a lookup request"],
    doesNot: "A hostname does not prove the machine is online or that any service is running.",
    misconceptions: ["Knowing the name means you can already reach the service."],
    analogy: "A name on a door plate. It is not the walk to the room.",
    example: "vault.corp",
  },
  dns: {
    id: "dns",
    name: "DNS",
    category: "name resolution",
    playable: true,
    character: "The Receptionist",
    plain: "DNS looks up a hostname and returns an IP address.",
    technical: "DNS commonly uses UDP port 53. Large answers, zone transfers, and some fallbacks use TCP port 53. A finished lookup is not a connection, a route, or proof that an application works.",
    problem: "You have a name and you need an address before anything can be forwarded.",
    inputs: ["hostname"],
    outputs: ["IP address, or a failure to resolve"],
    ports: [{ port: 53, proto: "UDP" }, { port: 53, proto: "TCP" }],
    doesNot: "DNS does not carry the web page, open a firewall, or check a certificate.",
    misconceptions: ["DNS always uses UDP.", "A successful lookup means the destination is reachable."],
    analogy: "The receptionist reads a name and writes down a number. She does not walk you there.",
    example: "vault.corp resolves to 10.8.1.20. That slip is only the number.",
    troubleshooting: ["If the name returns no address, stay on DNS before blaming a route, a firewall, TLS, or the application.", "If the IP works and the name does not, the break is the lookup."],
    prerequisites: ["hostname"],
  },
  ip: {
    id: "ip",
    name: "IP address",
    category: "addressing",
    playable: true,
    plain: "An IP address identifies an interface on a network, in that addressing context.",
    technical: "The address is what routing decisions are made about. Having the address does not mean a route exists or that the host answers.",
    problem: "Forwarding needs a destination address, not a nickname.",
    inputs: ["an address from DNS, from configuration, or from the user"],
    outputs: ["a destination identity for forwarding"],
    doesNot: "An address does not start a service, open a port, or encrypt anything.",
    misconceptions: ["If you know the IP, the path is fine."],
    analogy: "A room number. The number is not the hallway that leads there.",
    example: "10.8.1.20 identifies the vault's interface on that network.",
    prerequisites: [],
  },
  routing: {
    id: "routing",
    name: "Routing",
    category: "forwarding",
    playable: true,
    character: "The Network Guide",
    plain: "Routers forward packets between networks using routing information.",
    technical: "A host commonly uses its default gateway to reach destinations outside its own subnet. A correct IP does not guarantee that a route exists or that the destination answers.",
    problem: "The address may sit on a different network from the sender.",
    inputs: ["destination IP", "local routing information"],
    outputs: ["a forwarded packet, or a failure to find a path"],
    doesNot: "Routing does not resolve names, permit traffic by policy, or complete a TLS handshake.",
    misconceptions: ["A resolved name means the route is fine.", "The default gateway starts the application."],
    analogy: "The guide walks packets toward a room number. A wrong stair is not a wrong name.",
    example: "10.4.8.15 trying to reach 10.8.1.20 needs a gateway off its subnet.",
    troubleshooting: ["Name resolves, then 'no route' or the packet dies at a hop: investigate routing, not DNS."],
    prerequisites: ["ip"],
  },
  tcp: {
    id: "tcp",
    name: "TCP",
    category: "transport",
    playable: true,
    character: "The Courier",
    plain: "TCP carries a reliable, ordered stream of bytes between two endpoints.",
    technical: "TCP is connection-oriented. It retransmits lost data and delivers bytes in order. Ordinary HTTPS uses HTTP over TLS on TCP. A TCP connection is not a certificate check and not an application success.",
    problem: "Some applications need a dependable stream, not a single datagram.",
    inputs: ["bytes from an application", "a destination IP and port"],
    outputs: ["an ordered byte stream, or a connection failure"],
    ports: [],
    doesNot: "TCP does not choose the hostname, write firewall policy, or validate a certificate by itself.",
    misconceptions: ["TCP means the service is healthy.", "Every service on the internet uses TCP."],
    analogy: "A courier who numbers the pages and asks for any missing page again.",
    example: "A TCP connection to port 443 means the stream started. It does not mean TLS or the vault page succeeded.",
    prerequisites: ["ip"],
  },
  udp: {
    id: "udp",
    name: "UDP",
    category: "transport",
    playable: true,
    character: "The Courier",
    plain: "UDP sends datagrams without TCP's delivery and ordering guarantees.",
    technical: "Each datagram stands alone. The application handles loss if it cares. DNS commonly uses UDP and can also use TCP. HTTP/3 uses QUIC over UDP port 443.",
    problem: "Some jobs prefer a short message over a maintained stream.",
    inputs: ["a datagram", "a destination IP and port"],
    outputs: ["a sent datagram, without a TCP-style guarantee"],
    doesNot: "UDP does not promise order or delivery the way TCP does.",
    misconceptions: ["DNS can only use UDP.", "UDP means the packet is insecure."],
    analogy: "A note slid under a door. Nobody promises it arrived, and nobody numbers the pages.",
    example: "A short DNS question often goes out as one UDP datagram on port 53.",
    prerequisites: ["ip"],
  },
  port: {
    id: "port",
    name: "Port",
    category: "transport",
    playable: true,
    plain: "A port number identifies a transport endpoint for an application or service.",
    technical: "Ports belong to TCP or UDP, not to IP alone. A number in a list, on a door, or in a memory palace does not mean a process is listening, reachable, or working.",
    problem: "One address can host many services. The port tells them apart.",
    inputs: ["a transport protocol", "a port number"],
    outputs: ["an endpoint identity"],
    doesNot: "A port number does not start the service or grant permission to use it.",
    misconceptions: ["If the port is 'the HTTPS port,' the site is up."],
    analogy: "A slot number at the desk. The slot can be empty.",
    example: "TCP 443 is the usual endpoint for HTTPS. UDP 443 is where HTTP/3's QUIC listens. The number alone is not the service.",
    prerequisites: ["tcp", "udp"],
  },
  firewall: {
    id: "firewall",
    name: "Firewall",
    category: "policy",
    playable: true,
    character: "The Gatekeeper",
    plain: "A firewall enforces configured rules about which traffic may pass.",
    technical: "Rules can consider addresses, protocol, port, direction, and connection state. A deny is a policy decision. An allow does not create a route or start a stopped service.",
    problem: "Reachability is not the same as permission to pass.",
    inputs: ["a traffic attempt", "configured policy"],
    outputs: ["permit or deny"],
    doesNot: "A firewall does not resolve DNS, invent a route, or repair an application.",
    misconceptions: ["Every failure is a blocked port.", "An allow rule means the service is running."],
    analogy: "The gatekeeper checks a written rule. She does not draw the map or open the vault.",
    example: "A log that says 'deny tcp dport 443' is a different fact from a timeout with no deny, and different again from a TCP reset.",
    troubleshooting: ["Read the log before choosing a cause. A reset after an allow often means nothing is listening."],
    prerequisites: ["tcp", "udp", "port"],
  },
  tls: {
    id: "tls",
    name: "TLS",
    category: "secure communication",
    playable: true,
    character: "The Certificate Clerk",
    plain: "TLS protects a connection with encryption and integrity checks, and it checks the certificate the server presents.",
    technical: "Certificate validation asks whether that certificate can be trusted for the name you meant to reach. HTTPS is HTTP over TLS, commonly on TCP port 443. HTTP/3 uses QUIC over UDP port 443. A reachable port is not a finished handshake. Encryption is not user login and not permission to use the application.",
    problem: "A path that works can still be read or pointed at the wrong name.",
    inputs: ["a transport connection", "a presented certificate", "the name the user asked for"],
    outputs: ["a protected channel, or a validation failure"],
    ports: [{ port: 443, proto: "TCP" }, { port: 443, proto: "UDP" }],
    doesNot: "TLS does not, by itself, prove who the user is or what they are allowed to do.",
    misconceptions: ["Encryption means you are logged in.", "A lock icon means the application authorized you.", "Port 443 answers, so TLS succeeded."],
    analogy: "A sealed envelope with a name on the outside. The seal is not a badge that lets you into the vault.",
    example: "The envelope is sealed, but it is addressed to files.corp while you asked for vault.corp.",
    troubleshooting: ["If TCP connected and the alert names the certificate, investigate TLS before blaming DNS or the firewall."],
    prerequisites: ["tcp"],
  },
  http: {
    id: "http",
    name: "HTTP",
    category: "application",
    playable: true,
    plain: "HTTP is the application conversation for the web: requests and responses.",
    technical: "HTTP can travel in the open, commonly on TCP port 80. HTTPS is that same kind of conversation inside TLS. The status line is the application's report, not a DNS result.",
    problem: "The network can deliver bytes that still need an application meaning.",
    inputs: ["an application request"],
    outputs: ["a response, including errors the application itself produced"],
    ports: [{ port: 80, proto: "TCP" }, { port: 443, proto: "TCP" }],
    doesNot: "An HTTP error does not rewrite history. It does not mean DNS failed if the request arrived.",
    misconceptions: ["Any failure to load a page is an HTTP problem.", "500 and a DNS timeout are the same symptom."],
    analogy: "The conversation at the vault desk, after you have already arrived.",
    example: "HTTP 500 means the vault application received the request and failed at its own job.",
    prerequisites: ["tcp"],
  },
  application: {
    id: "application",
    name: "Application",
    category: "application",
    playable: true,
    character: "The Application Engineer",
    plain: "The application uses the network to exchange something a person actually wanted.",
    technical: "DNS, routing, transport, policy, and TLS can all succeed while the application still returns an error. The right evidence is whether a request arrived and what the application said about it.",
    problem: "A working path is not a working service.",
    inputs: ["a delivered request"],
    outputs: ["the service's result, or an application error"],
    doesNot: "The application does not resolve names or choose the route.",
    misconceptions: ["If the page fails, start by blaming DNS."],
    analogy: "The vault clerk can still lose the ledger after you have reached the desk.",
    example: "The engineer sees the request, then the index is missing. That is the vault's failure.",
    troubleshooting: ["Ask whether this layer was reached. A request that never arrived is not an application bug."],
    prerequisites: ["http"],
  },

  // Later wings. Fields are here so a quest can be added without a new model.
  directory: {
    id: "directory",
    name: "Directory",
    category: "identity",
    chain: "identity",
    plain: "A directory stores identity information: who exists, and attributes about them.",
    technical: "LDAP on 389, or LDAPS on 636, is one way to query a directory. It is not the only one, and a directory lookup is not proof the person authenticated.",
    doesNot: "A directory does not, by itself, verify a live login or grant permissions.",
    analogy: "The cabinet of names. Opening the cabinet is not the same as checking a badge at the door.",
  },
  authentication: {
    id: "authentication",
    name: "Authentication",
    category: "identity",
    chain: "identity",
    plain: "Authentication checks whether a claimant is who they say they are.",
    technical: "It can use a password, a key, a certificate, or more than one factor. Success means the identity was verified, not that every door is open.",
    doesNot: "Authentication does not decide what the person may do.",
    misconceptions: ["Logged in means authorized."],
  },
  mfa: {
    id: "mfa",
    name: "MFA",
    category: "identity",
    chain: "identity",
    plain: "MFA asks for more than one kind of evidence before accepting an identity.",
    technical: "A second factor strengthens authentication. It is not an authorization policy.",
    doesNot: "MFA does not choose which records a person may open.",
  },
  authorization: {
    id: "authorization",
    name: "Authorization",
    category: "identity",
    chain: "identity",
    plain: "Authorization decides what a verified identity is allowed to do.",
    technical: "It runs after an identity is known. A person can authenticate and still be refused.",
    doesNot: "Authorization does not prove identity. That was authentication's job.",
    misconceptions: ["A 401 and a 403 are the same fact."],
  },
  "access-control": {
    id: "access-control",
    name: "Access control",
    category: "identity",
    chain: "identity",
    plain: "Access control is the enforcement of an authorization decision.",
    technical: "The policy can live in an application, a gateway, or a system. Enforcement is not the directory and not the login prompt.",
    doesNot: "Enforcing a rule does not create the identity record.",
  },
  keypair: {
    id: "keypair",
    name: "Key pair",
    category: "pki",
    chain: "pki",
    plain: "A public key and a private key are a matched pair used in cryptography.",
    technical: "The private key is held by the owner. The public key can be shared, often inside a certificate.",
    doesNot: "A key pair is not a certificate and not a certificate authority.",
  },
  certificate: {
    id: "certificate",
    name: "Certificate",
    category: "pki",
    chain: "pki",
    plain: "A certificate binds a public key to a named subject and is signed by an issuer.",
    technical: "TLS uses the server certificate during the handshake. The certificate is not the user's password and not an application permission.",
    doesNot: "A certificate does not, by itself, revoke an older certificate or authorize a user.",
  },
  ca: {
    id: "ca",
    name: "Certificate authority",
    category: "pki",
    chain: "pki",
    plain: "A certificate authority issues certificates and signs them.",
    technical: "Trust in a TLS connection often traces back to a CA the client already trusts. Issuance is a different act from revocation.",
    doesNot: "Issuing a certificate is not the same as publishing a CRL or answering OCSP.",
  },
  revocation: {
    id: "revocation",
    name: "Revocation",
    category: "pki",
    chain: "pki",
    plain: "Revocation says a certificate should no longer be trusted, before it expires.",
    technical: "CRLs and OCSP are ways clients can learn that fact. They are not how a certificate is issued, and they are not the encryption of the session.",
    doesNot: "Revocation is not TLS encryption and not the act of issuing a certificate.",
    misconceptions: ["Encryption and revocation are the same control."],
  },
  logs: {
    id: "logs",
    name: "Logs and telemetry",
    category: "monitoring",
    chain: "monitoring",
    plain: "Logs and telemetry are records of what systems observed.",
    technical: "They are evidence. Collecting them does not, by itself, detect an incident or take an action.",
    doesNot: "A log line does not contain the response.",
  },
  siem: {
    id: "siem",
    name: "SIEM",
    category: "monitoring",
    chain: "monitoring",
    plain: "A SIEM collects and correlates security events so people can detect and investigate.",
    technical: "Correlation can reveal a pattern that one log hides. A SIEM does not automatically finish containment, and its features can overlap with SOAR.",
    doesNot: "A SIEM detection is not proof that a response succeeded.",
  },
  soar: {
    id: "soar",
    name: "SOAR",
    category: "monitoring",
    chain: "monitoring",
    plain: "SOAR orchestrates response steps, including automation, from playbooks.",
    technical: "It can take a SIEM's detection and run a response. Automation can overlap with what a SIEM does. Neither one guarantees recovery.",
    doesNot: "A playbook firing does not prove the incident is over.",
  },
  "incident-response": {
    id: "incident-response",
    name: "Incident response",
    category: "response",
    chain: "incident",
    plain: "Incident response is a sequence of decisions: detect, analyze, contain, eradicate, recover, and learn.",
    technical: "The fitting action depends on the evidence and on the harm of acting. Detection is not containment. Recovery is not the lesson learned.",
    doesNot: "Naming the phase does not choose the action. The evidence does.",
  },
};

const RELATIONS = [
  { id: "dns-resolves-ip", type: "resolves", from: "dns", to: "ip", playable: true, note: "DNS resolves a hostname to an IP address." },
  { id: "host-needs-dns", type: "depends on", from: "hostname", to: "dns", playable: true, note: "A hostname has to be resolved before it can be used as a destination address." },
  { id: "routing-routes-ip", type: "routes to", from: "routing", to: "ip", playable: true, note: "Routing forwards packets toward an IP address." },
  { id: "routing-depends-ip", type: "depends on", from: "routing", to: "ip", playable: true, note: "Routing needs an address. A name is not enough." },
  { id: "tcp-transports", type: "transports", from: "tcp", to: "application", playable: true, note: "TCP transports an ordered byte stream for applications that need one." },
  { id: "udp-transports", type: "transports", from: "udp", to: "dns", playable: true, note: "UDP can carry DNS queries. TCP can too." },
  { id: "port-identifies", type: "depends on", from: "port", to: "tcp", playable: true, note: "A port identifies a transport endpoint. It does not prove a listener." },
  { id: "firewall-protects", type: "protects", from: "firewall", to: "tcp", playable: true, note: "A firewall permits or blocks transport attempts according to policy." },
  { id: "tls-protects-http", type: "protects", from: "tls", to: "http", playable: true, note: "TLS protects HTTP in HTTPS. It also checks the presented certificate." },
  { id: "https-depends-tls", type: "depends on", from: "http", to: "tls", playable: true, note: "HTTPS is HTTP protected by TLS." },
  { id: "app-depends-path", type: "depends on", from: "application", to: "http", playable: true, note: "The application can still fail after the request is delivered." },
  { id: "dns-confused-connectivity", type: "commonly confused with", from: "dns", to: "routing", playable: true, note: "A failed page load is not automatically a DNS failure." },
  { id: "tls-confused-auth", type: "commonly confused with", from: "tls", to: "authentication", playable: true, note: "Encrypting a connection is not the same as authenticating the user." },
  { id: "tls-confused-authz", type: "commonly confused with", from: "tls", to: "authorization", playable: true, note: "A trusted certificate does not grant application permissions." },
  { id: "firewall-confused-route", type: "commonly confused with", from: "firewall", to: "routing", playable: true, note: "A missing route and a deny rule leave different evidence." },

  { id: "directory-provides-identity", type: "provides configuration for", from: "directory", to: "authentication", chain: "identity", note: "A directory can supply identity information. Authentication still has to verify a claimant." },
  { id: "authn-before-authz", type: "authenticates", from: "authentication", to: "authorization", chain: "identity", note: "Authentication verifies identity. Authorization decides what that identity may do." },
  { id: "mfa-strengthens-authn", type: "authenticates", from: "mfa", to: "authentication", chain: "identity", note: "MFA adds a factor to authentication. It is not the permission check." },
  { id: "authz-enforced-by-access", type: "authorizes", from: "authorization", to: "access-control", chain: "identity", note: "Access control enforces an authorization decision." },
  { id: "authn-confused-authz", type: "commonly confused with", from: "authentication", to: "authorization", chain: "identity", note: "A verified user can still be forbidden." },
  { id: "keypair-in-cert", type: "depends on", from: "certificate", to: "keypair", chain: "pki", note: "A certificate carries a public key from a key pair." },
  { id: "ca-issues-cert", type: "provides configuration for", from: "ca", to: "certificate", chain: "pki", note: "A CA issues and signs certificates." },
  { id: "revocation-not-issuance", type: "commonly confused with", from: "revocation", to: "ca", chain: "pki", note: "CRLs and OCSP distribute revocation. They are not issuance and not the TLS encryption itself." },
  { id: "tls-uses-cert", type: "depends on", from: "tls", to: "certificate", chain: "pki", note: "TLS validation uses the presented certificate and the name that was requested." },
  { id: "siem-collects-logs", type: "monitors", from: "siem", to: "logs", chain: "monitoring", note: "A SIEM collects and correlates logs. Correlation is not a completed response." },
  { id: "soar-orchestrates", type: "orchestrates", from: "soar", to: "siem", chain: "monitoring", note: "SOAR can orchestrate a response to what a SIEM detected. The two can overlap, and neither guarantees recovery." },
  { id: "ir-detects", type: "detects", from: "incident-response", to: "siem", chain: "incident", note: "Detection feeds analysis. Containment, eradication, recovery, and lessons learned are later decisions." },
];

const CHAINS = [
  { id: "name-to-app", title: "From name to application", status: "playable" },
  { id: "identity", title: "Identity and access", status: "later", order: ["directory", "authentication", "mfa", "authorization", "access-control"] },
  { id: "pki", title: "PKI and secure communication", status: "later", order: ["keypair", "certificate", "ca", "revocation", "tls"] },
  { id: "monitoring", title: "Security monitoring and response", status: "later", order: ["logs", "siem", "soar"] },
  { id: "incident", title: "Incident response", status: "later", order: ["incident-response"] },
];

function fb(misunderstood, does, whyNot, whyRight, related, nextTime) {
  return { misunderstood, does, whyNot, whyRight, related, nextTime };
}

const QUEST = {
  id: "name-to-app",
  title: "Quest 01: From Name to Application",
  start: "brief",
  scenes: {
    brief: {
      id: "brief",
      kind: "talk",
      character: "The Receptionist",
      job: "DNS",
      concept: "dns",
      concepts: ["hostname", "dns"],
      room: { port: 53 },
      analogy: "She can write down a room number. She cannot walk the hall for you.",
      mechanism: "You start with a hostname. DNS can turn that name into an IP address. The address is not a route, a connection, or a working application.",
      setup: "You need the vault page at vault.corp. Six people work this trip, and each one does a different job. The receptionist is first because you have a name, not a number.",
      choices: [
        {
          id: "ask",
          label: "Ask her to look up vault.corp",
          correct: true,
          concepts: ["dns"],
          relations: ["host-needs-dns"],
          next: "dns-ask",
          because: "The name has to be resolved before anyone can forward traffic toward an address. That lookup is her job.",
        },
      ],
    },
    "dns-ask": {
      id: "dns-ask",
      kind: "case",
      character: "The Receptionist",
      job: "DNS",
      concept: "dns",
      concepts: ["dns", "ip"],
      relations: ["dns-resolves-ip"],
      reviews: ["dns"],
      requireEvidence: true,
      room: { port: 53 },
      analogy: "She writes a number on a slip. She does not open the vault.",
      mechanism: "DNS resolves vault.corp to an IP address. UDP 53 is common. TCP 53 is also DNS. The slip does not mean the host is reachable.",
      setup: "You ask for vault.corp. She does not leave the desk. She hands you a slip. Read it before you decide what it proves.",
      evidence: [
        { id: "slip", title: "Lookup slip", body: "vault.corp → 10.8.1.20. Query answered on UDP port 53." },
        { id: "not-yet", title: "What has not happened", body: "No packet has been sent to 10.8.1.20. No port has answered. No page has loaded." },
      ],
      choices: [
        {
          id: "address",
          label: "She gave me an address. The vault page is still unproven.",
          correct: true,
          concepts: ["dns", "ip"],
          relations: ["dns-resolves-ip"],
          next: "dns-fail",
          because: "Resolution produced an address. Reachability, policy, TLS, and the application have not run.",
        },
        {
          id: "loaded",
          label: "The lookup worked, so the vault page will load.",
          correct: false,
          concepts: ["dns"],
          relations: ["dns-confused-connectivity"],
          feedback: fb(
            "You treated a finished lookup as a finished trip.",
            "DNS returns an address for a name. That is the whole job.",
            "Nothing has been forwarded to 10.8.1.20, so the page has not been tested.",
            "The slip is evidence of an address only. The next question is whether a path to that address exists.",
            "Routing",
            "When a name resolves, ask what that answer does not prove: route, listener, certificate, application."
          ),
        },
        {
          id: "tls",
          label: "This slip means the connection is already encrypted.",
          correct: false,
          concepts: ["dns", "tls"],
          relations: ["dns-resolves-ip"],
          feedback: fb(
            "You gave DNS a job that belongs to TLS.",
            "DNS translates a name to an address. TLS later protects a connection and checks a certificate.",
            "The slip mentions UDP 53 and an address. It says nothing about a certificate or an envelope.",
            "Encryption has not started, because no connection to the vault has started.",
            "TLS",
            "Check which layer produced the evidence in your hand. A DNS answer is not a handshake."
          ),
        },
      ],
    },
    "dns-fail": {
      id: "dns-fail",
      kind: "case",
      character: "The Receptionist",
      job: "DNS",
      concept: "dns",
      concepts: ["dns"],
      relations: ["dns-resolves-ip", "dns-confused-connectivity"],
      reviews: ["dns"],
      requireEvidence: true,
      room: { port: 53 },
      analogy: "A second name is not in her book. That does not move the stairways.",
      mechanism: "If DNS returns no address, later stages have no destination to use. Fix the name lookup before investigating a route you never attempted.",
      setup: "A colleague asks for atlas.corp. The vault slip is still in your other hand. These are two different names.",
      evidence: [
        { id: "atlas", title: "Atlas lookup", body: "atlas.corp: no address returned. The query timed out. No connection was attempted." },
        { id: "vault", title: "Vault slip, still good", body: "vault.corp → 10.8.1.20. This answer says nothing about atlas.corp." },
      ],
      choices: [
        {
          id: "name",
          label: "Atlas failed at name resolution. I should not skip ahead.",
          correct: true,
          concepts: ["dns"],
          relations: ["dns-resolves-ip", "dns-confused-connectivity"],
          next: "route",
          because: "There is no address for atlas.corp, and no later stage was attempted. The vault's address does not repair a different name.",
        },
        {
          id: "firewall",
          label: "The firewall blocked atlas on port 443.",
          correct: false,
          concepts: ["dns", "firewall"],
          relations: ["firewall-confused-route"],
          feedback: fb(
            "You picked a policy failure without any connection attempt.",
            "A firewall acts on traffic. DNS failure means the name never became an address.",
            "The slip says the lookup timed out and that no connection was attempted. There is no deny log and no port 443 attempt.",
            "The evidence stops at the receptionist. Investigate the name before the gate.",
            "Firewall",
            "Ask whether traffic was ever sent. If it was not, a firewall rule is not the fact in front of you."
          ),
        },
        {
          id: "route",
          label: "Routing to atlas is broken.",
          correct: false,
          concepts: ["dns", "routing"],
          relations: ["routing-depends-ip"],
          feedback: fb(
            "You diagnosed a route for a destination that has no address.",
            "Routing forwards toward an IP address. DNS is what produces that address from a name.",
            "Atlas has no address, so a route was never looked up. 'No route' is not what the slip says.",
            "This symptom is a failed lookup. A routing problem would start from a known address.",
            "Routing",
            "Separate 'the name did not resolve' from 'the address did not forward.'"
          ),
        },
      ],
    },
    route: {
      id: "route",
      kind: "case",
      character: "The Network Guide",
      job: "Routing",
      concept: "routing",
      concepts: ["ip", "routing"],
      relations: ["routing-routes-ip", "routing-depends-ip"],
      reviews: ["routing"],
      requireEvidence: true,
      room: { key: "route", color: "#1f8f86", paper: "grid", detail: "🧭" },
      analogy: "The guide follows room numbers. A correct number can still open onto a stair that goes nowhere.",
      mechanism: "10.8.1.20 identifies an interface. Your host is on a different subnet, so it uses a default gateway to leave. A wrong gateway is a routing problem, not a DNS problem.",
      setup: "You still hold vault.corp → 10.8.1.20. The guide spreads a map of your own desk and the first step off your floor.",
      evidence: [
        { id: "you", title: "Your desk", body: "Your address is 10.4.8.15 on subnet 10.4.8.0/24. The vault address 10.8.1.20 is not on that subnet." },
        { id: "gate", title: "Gateway slip", body: "Default gateway is set to 10.4.8.99. Nothing answers there. The try toward 10.8.1.20 ends: no route to host." },
        { id: "name", title: "Name slip", body: "vault.corp still resolves to 10.8.1.20. The lookup is not the line that failed." },
      ],
      choices: [
        {
          id: "gateway",
          label: "The name resolved. The path off my subnet is the break.",
          correct: true,
          concepts: ["routing", "ip"],
          relations: ["routing-routes-ip", "dns-confused-connectivity"],
          next: "transport",
          because: "DNS already produced the address. The failed fact is the default gateway, which is how this host reaches other subnets.",
        },
        {
          id: "dns",
          label: "DNS is wrong because the vault did not answer.",
          correct: false,
          concepts: ["routing", "dns"],
          relations: ["dns-confused-connectivity"],
          feedback: fb(
            "You sent a routing symptom back to the receptionist.",
            "DNS already returned 10.8.1.20. Routing is the job that forwards toward that address.",
            "The failure text is 'no route to host,' and the gateway 10.4.8.99 does not answer. The name slip did not change.",
            "The address is known. The missing piece is a working path off the local subnet.",
            "DNS",
            "If the name resolves and the error talks about a route or a gateway, stay with routing."
          ),
        },
        {
          id: "cert",
          label: "The certificate was rejected.",
          correct: false,
          concepts: ["routing", "tls"],
          relations: ["routing-routes-ip"],
          feedback: fb(
            "You jumped to TLS before any connection existed.",
            "TLS checks a certificate on a connection that has already reached the server.",
            "The map says no route to host. No TCP connection started, so no certificate was presented.",
            "The evidence is a bad gateway for a known address.",
            "TLS",
            "Certificate errors name a certificate. 'No route' does not."
          ),
        },
      ],
    },
    "route-far": {
      id: "route-far",
      kind: "case",
      character: "The Network Guide",
      job: "Routing",
      concept: "routing",
      concepts: ["routing"],
      relations: ["routing-routes-ip"],
      reviews: ["routing"],
      requireEvidence: true,
      practice: true,
      room: { key: "route", color: "#1f8f86", paper: "grid", detail: "🧭" },
      analogy: "The first stair is real. A later landing is missing.",
      mechanism: "A correct default gateway only gets the packet to the first router. A later hop can still have no path. That is still routing.",
      setup: "A different afternoon. The name resolved, and your own gateway answers. The packet dies further along.",
      evidence: [
        { id: "dns", title: "Name", body: "ledger.corp → 10.9.4.12. Lookup succeeded." },
        { id: "hop", title: "Path", body: "Your gateway 10.4.8.1 answers. The next router replies: network unreachable. No attempt was made to port 443." },
      ],
      choices: [
        {
          id: "path",
          label: "DNS worked. The route fails past the gateway.",
          correct: true,
          concepts: ["routing"],
          relations: ["routing-routes-ip"],
          next: "done",
          because: "The address is known and the first gateway is alive. The unreachable network is a routing failure further on. Firewall and TLS were not reached.",
        },
        {
          id: "dns",
          label: "DNS handed out a useless name.",
          correct: false,
          concepts: ["routing", "dns"],
          relations: ["dns-confused-connectivity"],
          feedback: fb(
            "You blamed the lookup after it had already succeeded.",
            "DNS produced 10.9.4.12. The new fact is a router saying the network is unreachable.",
            "A bad lookup would have produced no address, or a timeout at the receptionist.",
            "This is a path problem after a good address.",
            "DNS",
            "Read the hop that failed. A router message about a network is routing evidence."
          ),
        },
        {
          id: "fw",
          label: "The firewall dropped port 443.",
          correct: false,
          concepts: ["routing", "firewall"],
          relations: ["firewall-confused-route"],
          feedback: fb(
            "You named a port that was never tried.",
            "A firewall decision shows up when traffic hits a policy. Here the path died before any port 443 attempt.",
            "The slip says no attempt was made to port 443, and the error is 'network unreachable' from a router.",
            "The break is the route past the gateway.",
            "Firewall",
            "Do not assign a port block unless something records a port attempt or a deny."
          ),
        },
      ],
    },
    transport: {
      id: "transport",
      kind: "case",
      character: "The Courier",
      job: "TCP and UDP",
      concept: "tcp",
      concepts: ["tcp", "udp", "port", "dns"],
      relations: ["tcp-transports", "udp-transports", "port-identifies"],
      reviews: ["tcp", "udp", "port"],
      requireEvidence: true,
      room: { key: "courier", color: "#f0c043", paper: "arrows", detail: "📦" },
      analogy: "One courier numbers the pages. The other slides a single note. The slot number on the door can still be empty.",
      mechanism: "TCP is a reliable ordered stream. UDP sends datagrams without that guarantee. DNS uses both UDP 53 and TCP 53. Ordinary HTTPS in this palace is HTTP over TLS on TCP. A painted port does not mean a service is listening. HTTP/3, later, is QUIC over UDP 443.",
      setup: "The guide has a path now. The courier wants to know what kind of carrying this vault page needs, and what the number on the door means.",
      evidence: [
        { id: "page", title: "Vault request", body: "Ordinary HTTPS: the web conversation must arrive complete and in order." },
        { id: "dns-both", title: "How DNS traveled", body: "The short lookup used UDP port 53. A large answer came back on TCP port 53. Both were DNS." },
        { id: "door", title: "The door", body: "Someone painted 443 on the vault door. Nothing has answered. No listener has been confirmed." },
      ],
      choices: [
        {
          id: "tcp",
          label: "This page wants TCP. The painted 443 does not prove a listener. DNS can use UDP or TCP.",
          correct: true,
          concepts: ["tcp", "udp", "port"],
          relations: ["tcp-transports", "udp-transports", "port-identifies"],
          next: "fw-deny",
          because: "Ordinary HTTPS needs TCP's ordered stream. Port 443 on a door is only a number. DNS is the example that uses both UDP and TCP on 53.",
        },
        {
          id: "udp-only",
          label: "Use UDP, because DNS uses UDP and so does the web.",
          correct: false,
          concepts: ["udp", "tcp"],
          relations: ["udp-transports"],
          feedback: fb(
            "You copied DNS's usual datagram onto a job that asked for a reliable stream.",
            "UDP does not provide TCP's delivery and ordering. Ordinary HTTPS uses TCP. DNS itself is allowed to use TCP 53 as well as UDP 53.",
            "The vault slip asks for a complete, ordered conversation. That is TCP's behavior, not UDP's.",
            "Carry this page with TCP. Remember the large DNS answer as proof that DNS is not UDP-only.",
            "DNS",
            "Match the transport to the job. Do not inherit UDP from an unrelated service."
          ),
        },
        {
          id: "listening",
          label: "TCP, and the 443 on the door means the vault is up.",
          correct: false,
          concepts: ["port", "tcp"],
          relations: ["port-identifies"],
          feedback: fb(
            "The transport choice is right, and the conclusion about the door is not.",
            "A port identifies an endpoint. It does not mean a process is listening or healthy.",
            "The door evidence says nothing has answered. Paint is not a handshake.",
            "Choose TCP for this page, and treat 443 as an untested endpoint until something answers.",
            "Port",
            "Split 'which transport fits' from 'is anything listening.'"
          ),
        },
      ],
    },
    "fw-deny": {
      id: "fw-deny",
      kind: "case",
      character: "The Gatekeeper",
      job: "Firewall",
      concept: "firewall",
      concepts: ["firewall"],
      relations: ["firewall-protects", "firewall-confused-route"],
      reviews: ["firewall"],
      requireEvidence: true,
      room: { key: "gate", color: "#c4473a", paper: "hazard", detail: "🚧" },
      analogy: "She reads a written rule. She does not repaint the room number.",
      mechanism: "A firewall permits or blocks by policy: address, protocol, port, direction, state. A deny log is that decision. It is different evidence from a DNS miss or a dead service.",
      setup: "The name, the route, and the courier are ready. The gate stops the trip. Read her book before you name the cause.",
      evidence: [
        { id: "dns", title: "Name", body: "vault.corp → 10.8.1.20. Lookup succeeded." },
        { id: "path", title: "Path", body: "The route reaches the gate. Packets are not dying with 'no route.'" },
        { id: "log", title: "Gate log", body: "deny tcp to 10.8.1.20 destination port 443. No TLS alert, because the connection never started." },
      ],
      choices: [
        {
          id: "policy",
          label: "Her policy blocked the TCP attempt. DNS and the route had already worked.",
          correct: true,
          concepts: ["firewall"],
          relations: ["firewall-protects"],
          next: "fw-rst",
          because: "The log is an explicit deny of tcp/443. That is policy. It does not rewind the successful lookup or the route.",
        },
        {
          id: "dns",
          label: "DNS is down.",
          correct: false,
          concepts: ["firewall", "dns"],
          relations: ["dns-confused-connectivity"],
          feedback: fb(
            "You replaced a deny log with a lookup failure.",
            "DNS already returned 10.8.1.20. The firewall then refused the TCP attempt.",
            "A DNS failure would show a lookup timeout or no address, not a deny of port 443.",
            "The new evidence is the gate's rule.",
            "DNS",
            "A deny line names a policy. Do not trade it for an earlier stage that already succeeded."
          ),
        },
        {
          id: "app",
          label: "The vault application crashed.",
          correct: false,
          concepts: ["firewall", "application"],
          relations: ["firewall-protects"],
          feedback: fb(
            "A dead service can look like silence, but this log is not silence.",
            "The gate recorded a deny. The vault never received a connection, so its crash is not what was observed.",
            "An allow followed by a reset would be a better hint that nothing is listening. This line says deny.",
            "The cause that fits the log is the firewall rule. An allow rule still would not start the service.",
            "Application",
            "Use the words in the evidence. 'Deny' is a policy. A crashed service is a guess until the packet gets through."
          ),
        },
      ],
    },
    "fw-rst": {
      id: "fw-rst",
      kind: "case",
      character: "The Gatekeeper",
      job: "Firewall",
      concept: "firewall",
      concepts: ["firewall", "port"],
      relations: ["firewall-protects", "port-identifies"],
      reviews: ["firewall", "port"],
      requireEvidence: true,
      room: { key: "gate", color: "#c4473a", paper: "hazard", detail: "🚧" },
      analogy: "She waves you through. The slot behind her is empty. Her wave did not staff the desk.",
      mechanism: "An allow rule is permission, not a running process. A TCP reset after an allow means the attempt passed policy and nothing accepted it. That is not a certificate error.",
      setup: "Same vault, next hour. Her book has changed. The symptom has changed with it.",
      evidence: [
        { id: "allow", title: "Gate log", body: "allow tcp to 10.8.1.20 destination port 443." },
        { id: "rst", title: "Courier's note", body: "The attempt was reset. Connection refused. No certificate was offered." },
        { id: "earlier", title: "Earlier slips", body: "DNS still resolves. The route still reaches the gate." },
      ],
      choices: [
        {
          id: "listener",
          label: "The rule allows it, and nothing is listening on 443.",
          correct: true,
          concepts: ["firewall", "port"],
          relations: ["firewall-protects", "port-identifies"],
          next: "tls",
          because: "Allow plus a reset means policy let the attempt through and no service accepted TCP 443. The allow did not start the vault.",
        },
        {
          id: "blocked",
          label: "The firewall still blocked it.",
          correct: false,
          concepts: ["firewall"],
          relations: ["firewall-protects"],
          feedback: fb(
            "You kept the previous hour's diagnosis after the evidence changed.",
            "A block would be a deny. This log says allow, and the courier got a reset.",
            "A reset is the far end, or something in front of it, refusing the connection. It is not the deny you saw before.",
            "Policy passed. The missing piece is a listener on that port.",
            "Port",
            "Re-read the log when the symptom changes. Allow and deny are different facts."
          ),
        },
        {
          id: "cert",
          label: "The certificate was rejected.",
          correct: false,
          concepts: ["firewall", "tls"],
          relations: ["tls-protects-http"],
          feedback: fb(
            "A certificate check happens after TCP is accepted.",
            "TLS validation needs a handshake. This attempt was reset, and the note says no certificate was offered.",
            "Connection refused is transport evidence. A certificate error would name a certificate problem after the connection.",
            "Nothing is listening. TLS has not started.",
            "TLS",
            "If no certificate appears in the evidence, do not diagnose the certificate."
          ),
        },
      ],
    },
    tls: {
      id: "tls",
      kind: "case",
      character: "The Certificate Clerk",
      job: "TLS",
      concept: "tls",
      concepts: ["tls", "http"],
      relations: ["tls-protects-http", "https-depends-tls", "tls-confused-auth"],
      reviews: ["tls"],
      requireEvidence: true,
      room: { port: 443 },
      analogy: "The envelope is sealed. The name on the outside is the wrong person. The seal is not a badge.",
      mechanism: "TLS encrypts and checks integrity, and certificate validation checks the name that was presented against the name you asked for. HTTPS here is HTTP over TLS on TCP 443. HTTP/3 would be QUIC on UDP 443. A reachable port is not a finished handshake. Encryption does not log the user in or grant permissions.",
      setup: "A listener is up. The courier completes TCP to port 443. The clerk holds the envelope up to the light.",
      evidence: [
        { id: "tcp", title: "Courier", body: "TCP to 10.8.1.20 port 443 connected." },
        { id: "cert", title: "Envelope", body: "Certificate name: files.corp. You asked for vault.corp. The envelope is sealed. The name does not match." },
        { id: "user", title: "What the seal is not", body: "No user has authenticated. No application permission has been granted." },
      ],
      choices: [
        {
          id: "name",
          label: "Certificate validation failed. Encryption did not log me in or let me in.",
          correct: true,
          concepts: ["tls"],
          relations: ["tls-protects-http", "tls-confused-auth", "tls-confused-authz"],
          next: "app",
          because: "TCP reached the port, and the presented name is not vault.corp. That is a TLS identity check. The seal is not user authentication or authorization.",
        },
        {
          id: "fw",
          label: "The firewall blocked port 443.",
          correct: false,
          concepts: ["tls", "firewall"],
          relations: ["firewall-protects"],
          feedback: fb(
            "You diagnosed a block after the connection had already succeeded.",
            "A firewall deny stops the TCP connection. The courier already connected.",
            "The new fact is the certificate name files.corp versus the name vault.corp.",
            "This failure is certificate validation inside TLS.",
            "Firewall",
            "Once TCP is connected, a later error is no longer 'the port was blocked.'"
          ),
        },
        {
          id: "login",
          label: "It is encrypted, so I am authenticated and allowed in.",
          correct: false,
          concepts: ["tls"],
          relations: ["tls-confused-auth", "tls-confused-authz"],
          feedback: fb(
            "You treated the seal as a badge and as a permission.",
            "TLS protects the conversation and checks the server certificate. User authentication and authorization are different jobs.",
            "The evidence says no user authenticated and no permission was granted. The name on the certificate is also wrong.",
            "Even a matching certificate would not log you in. This one does not match, so validation fails first.",
            "Authentication",
            "Split four ideas: the path, the encryption, who the user is, and what they may do."
          ),
        },
      ],
    },
    app: {
      id: "app",
      kind: "case",
      character: "The Application Engineer",
      job: "The vault application",
      concept: "application",
      concepts: ["application", "http"],
      relations: ["app-depends-path"],
      reviews: ["application"],
      requireEvidence: true,
      room: { port: 80 },
      analogy: "You reached the desk. The clerk can still lose the ledger.",
      mechanism: "The application is the job the person wanted. It can fail after DNS, routing, TCP, and TLS have all succeeded. An HTTP 500 here means the request arrived and the application failed.",
      setup: "The clerk accepts a certificate named vault.corp. The engineer is holding today's log.",
      evidence: [
        { id: "lower", title: "Earlier jobs", body: "DNS resolved. The route worked. TCP connected. TLS accepted the name vault.corp." },
        { id: "http", title: "Vault log", body: "Request arrived. Response: HTTP 500, archive index missing. The engineer saw the request." },
      ],
      choices: [
        {
          id: "app",
          label: "The application failed after the path and TLS had worked.",
          correct: true,
          concepts: ["application", "http"],
          relations: ["app-depends-path"],
          next: "dots",
          because: "The request arrived, so earlier stages did their jobs. HTTP 500 is the vault application failing at its own work.",
        },
        {
          id: "dns",
          label: "DNS sent me to the wrong place.",
          correct: false,
          concepts: ["application", "dns"],
          relations: ["dns-confused-connectivity"],
          feedback: fb(
            "You restarted the chain after the application had already received the request.",
            "DNS resolves names. The engineer saw this request arrive, which means the name, the route, and the connection had a destination.",
            "A wrong lookup would fail before an HTTP status from the vault.",
            "The status was produced by the application that received the request.",
            "DNS",
            "If the application log contains the request, the failure is at the application or in what it asked of itself."
          ),
        },
        {
          id: "tls",
          label: "The certificate was still the problem.",
          correct: false,
          concepts: ["application", "tls"],
          relations: ["tls-protects-http"],
          feedback: fb(
            "You kept a TLS diagnosis after validation had succeeded.",
            "TLS already accepted the name vault.corp. The new evidence is an HTTP 500 from the application.",
            "A certificate failure would stop the handshake and the engineer would not see an application request.",
            "The request arrived. The archive index is the application's failure.",
            "TLS",
            "When a later log says the request arrived, stop blaming the stage that already let it through."
          ),
        },
      ],
    },
    dots: {
      id: "dots",
      kind: "dots",
      character: "The Receptionist",
      job: "The whole trip",
      concept: "application",
      concepts: ["hostname", "dns", "ip", "routing", "firewall", "tcp", "tls", "application"],
      room: { port: 53 },
      analogy: "The palace is one building. The desks are not the same desk.",
      mechanism: "This map is a troubleshooting path for a name-based HTTPS request. It is not a diagram of every packet. Real stacks have more steps, and HTTP/3 uses UDP.",
      setup: "Connect each job to the job that receives its result. First click is the producer. Second click is the consumer. Order matters.",
      note: "One path for this quest: name, lookup, address, route, policy, TCP, TLS, application. Some real trips skip or reorder pieces.",
      nodes: [
        { id: "host", label: "Hostname" },
        { id: "dns", label: "DNS" },
        { id: "ip", label: "IP address" },
        { id: "routing", label: "Routing" },
        { id: "firewall", label: "Firewall" },
        { id: "tcp", label: "TCP" },
        { id: "tls", label: "TLS" },
        { id: "app", label: "Application" },
      ],
      links: [
        { from: "host", to: "dns", label: "the name is handed to DNS", relation: "host-needs-dns" },
        { from: "dns", to: "ip", label: "DNS resolves the name to an address", relation: "dns-resolves-ip" },
        { from: "ip", to: "routing", label: "routing forwards toward that address", relation: "routing-routes-ip" },
        { from: "routing", to: "firewall", label: "traffic that has a path can still be filtered", relation: "firewall-confused-route" },
        { from: "firewall", to: "tcp", label: "an allow is permission for the transport attempt", relation: "firewall-protects" },
        { from: "tcp", to: "tls", label: "the TLS handshake rides the connection", relation: "https-depends-tls" },
        { from: "tls", to: "app", label: "the application request rides inside TLS", relation: "tls-protects-http" },
      ],
      explain: {
        prompt: "DNS sits before routing on your map. Why is that the useful order when a person typed a name?",
        choices: [
          {
            id: "order",
            label: "Routing needs an address. DNS is what turns the typed name into that address. The lookup is not the route.",
            correct: true,
            concepts: ["dns", "routing"],
            relations: ["dns-resolves-ip", "routing-depends-ip"],
            next: "capstone",
            because: "You connected the output of DNS to the input routing actually uses. That is a troubleshooting order, not a claim that every packet looks like this.",
          },
          {
            id: "carries",
            label: "DNS carries the web page to the server, so it has to go first.",
            correct: false,
            concepts: ["dns"],
            relations: ["dns-confused-connectivity"],
            feedback: fb(
              "You gave DNS the jobs of transport and the application.",
              "DNS produces an address from a name. It does not carry the page.",
              "The page moves later, if a route, a policy, a transport, and TLS all get that far.",
              "DNS is first here only because the typed input was a name and routing cannot use a name.",
              "Routing",
              "Ask what each box takes in and what it hands off. Connect those, not the story of the whole trip."
            ),
          },
        ],
      },
    },
    capstone: {
      id: "capstone",
      kind: "case",
      character: "The Certificate Clerk",
      job: "A new outage",
      concept: "tls",
      concepts: ["dns", "routing", "tcp", "firewall", "tls", "application"],
      relations: ["tls-protects-http"],
      reviews: ["tls"],
      requireEvidence: true,
      room: { port: 443 },
      analogy: "A new envelope, a new name, the same rule: read every slip before you pick a desk.",
      mechanism: "ledger.corp is not vault.corp. An expired certificate fails TLS validation after the connection starts. The application never sees a request it did not receive.",
      setup: "New problem. Someone says ledger.corp does not load. You have not seen these slips before. Open all of them.",
      evidence: [
        { id: "dns", title: "Receptionist", body: "ledger.corp → 10.9.4.12. Lookup succeeded." },
        { id: "route", title: "Guide", body: "The path reaches 10.9.4.12. No 'unreachable' and no 'no route.'" },
        { id: "tcp", title: "Courier", body: "TCP connected to 10.9.4.12 port 443." },
        { id: "tls", title: "Clerk", body: "TLS alert: certificate expired. The handshake did not finish." },
        { id: "app", title: "Engineer", body: "Application log: no request from this attempt arrived today." },
      ],
      choices: [
        {
          id: "expired",
          label: "TLS stopped it. The certificate is expired. DNS, the route, and TCP had already worked, and the app saw nothing.",
          correct: true,
          concepts: ["tls"],
          relations: ["tls-protects-http", "app-depends-path"],
          next: "done",
          because: "You matched the alert to the stage that produced it, and you used the empty application log to avoid blaming a request that never arrived.",
        },
        {
          id: "appdown",
          label: "The application is down, because the page did not load.",
          correct: false,
          concepts: ["application", "tls"],
          relations: ["app-depends-path"],
          feedback: fb(
            "You treated a failed page as an application failure without a request.",
            "The application reports on requests it receives. This log says none arrived.",
            "The handshake died on an expired certificate, which is before the application conversation.",
            "The fitting cause is the expired certificate. The empty log supports that, it does not indict the app.",
            "Application",
            "Ask whether this stage was reached. 'The page failed' is the symptom, not the layer."
          ),
        },
        {
          id: "dns",
          label: "DNS failed to find ledger.corp.",
          correct: false,
          concepts: ["dns", "tls"],
          relations: ["dns-confused-connectivity"],
          feedback: fb(
            "You named a stage whose slip shows success.",
            "The receptionist returned 10.9.4.12. Later slips use that address.",
            "A DNS failure would stop the story before a TCP connection to a resolved address.",
            "The alert that matches the outage is the expired certificate.",
            "DNS",
            "Do not reopen a stage that has a successful slip unless new evidence contradicts it."
          ),
        },
        {
          id: "fw",
          label: "The firewall dropped the connection.",
          correct: false,
          concepts: ["firewall", "tls"],
          relations: ["firewall-protects"],
          feedback: fb(
            "You chose a block after TCP had connected.",
            "A drop or a deny would stop the courier. The courier connected, and the clerk produced a TLS alert.",
            "There is no deny in these slips. There is an expired certificate.",
            "The handshake failed validation. That is TLS.",
            "Firewall",
            "A completed TCP connection is evidence against 'the port never got through,' unless a later hop is documented."
          ),
        },
      ],
    },
    done: {
      id: "done",
      kind: "done",
      character: "The Receptionist",
      job: "The building",
      concept: "application",
      concepts: ["dns", "routing", "tcp", "firewall", "tls", "application"],
      room: { port: 53 },
      analogy: "You can still visit any desk. None of them quit to do another desk's job.",
      mechanism: "A name is not a path. An address is not a route. A port is not a listener. An allow is not a running service. A seal is not a login. A delivered request can still fail in the application.",
      setup: "You walked one chain. The next outage will not reuse these slips. Take the jobs with you, not the answers.",
      recap: [
        "DNS turns a name into an address and can use UDP 53 or TCP 53. The lookup is not connectivity.",
        "An IP address identifies an interface. Routing, often via a default gateway, is what leaves your subnet.",
        "TCP carries a reliable ordered stream. UDP carries datagrams without that promise. A port number only names an endpoint.",
        "A firewall enforces policy. Its allow does not create a route or start a service.",
        "TLS protects the conversation and checks the certificate. That is not user login and not permission.",
        "The application can fail after every earlier job succeeded. Match the cause to the evidence, not to the symptom alone.",
      ],
    },
  },
};

function conceptById(id) {
  return CONCEPTS[id] || null;
}

function playableConcepts() {
  return Object.values(CONCEPTS).filter((c) => c.playable);
}

function playableRelations() {
  return RELATIONS.filter((r) => r.playable);
}

function questScene(id) {
  return QUEST.scenes[id] || null;
}

function scenesReviewing(conceptId) {
  return Object.values(QUEST.scenes).filter((scene) => (scene.reviews || []).includes(conceptId));
}

function dotsPairFeedback(fromId, toId) {
  const scene = QUEST.scenes.dots;
  const reversed = scene.links.find((link) => link.from === toId && link.to === fromId);
  const from = scene.nodes.find((node) => node.id === fromId);
  const to = scene.nodes.find((node) => node.id === toId);
  const fromName = from ? from.label : fromId;
  const toName = to ? to.label : toId;
  if (reversed) {
    return fb(
      `${fromName} does not hand its result to ${toName}. The result flows the other way.`,
      reversed.label.charAt(0).toUpperCase() + reversed.label.slice(1) + ".",
      "Reversing the desks makes a later job look like it produces an earlier one.",
      `Connect ${scene.nodes.find((node) => node.id === reversed.from).label} → ${scene.nodes.find((node) => node.id === reversed.to).label}: ${reversed.label}.`,
      fromName,
      "Ask which desk produces the fact, and which desk consumes it."
    );
  }
  const producer = scene.links.find((link) => link.from === fromId);
  return fb(
    `${fromName} does not hand this result to ${toName}.`,
    producer
      ? `${fromName} hands its result onward like this: ${producer.label}.`
      : `${fromName} is an end of this path, not a producer for ${toName}.`,
    "A line between unrelated jobs hides the one fact you would actually check next.",
    producer
      ? `From ${fromName}, the next consumer on this path is ${producer.to}.`
      : "Start from the hostname and follow each output once.",
    fromName,
    "Connect an output to the next job that uses it. Leave the other desks for their own outputs."
  );
}

function auditPalaceModel() {
  const errors = [];
  const sceneIds = new Set(Object.keys(QUEST.scenes));
  if (!sceneIds.has(QUEST.start)) errors.push("missing start");
  const dns = CONCEPTS.dns;
  if (!/UDP/.test(dns.technical) || !/TCP/.test(dns.technical)) errors.push("dns should name UDP and TCP");
  if (/always uses UDP/i.test(dns.technical)) errors.push("dns marked as always UDP");
  for (const rel of RELATIONS) {
    if (!CONCEPTS[rel.from] || !CONCEPTS[rel.to]) errors.push("bad relation " + rel.id);
  }
  for (const scene of Object.values(QUEST.scenes)) {
    if (scene.id !== scene.id) errors.push("scene");
    if (!CONCEPTS[scene.concept]) errors.push("scene concept " + scene.id);
    const pools = [scene.choices || []];
    if (scene.explain) pools.push(scene.explain.choices || []);
    for (const pool of pools) {
      const good = pool.filter((choice) => choice.correct);
      if (pool.length && good.length !== 1) errors.push("need one correct in " + scene.id);
      for (const choice of pool) {
        if (choice.next && !sceneIds.has(choice.next)) errors.push("missing next " + choice.next);
        for (const id of choice.concepts || []) if (!CONCEPTS[id]) errors.push("choice concept " + id);
        for (const id of choice.relations || []) if (!RELATIONS.some((rel) => rel.id === id)) errors.push("choice relation " + id);
        if (!choice.correct) {
          const fields = ["misunderstood", "does", "whyNot", "whyRight", "related", "nextTime"];
          for (const field of fields) {
            if (!choice.feedback || !choice.feedback[field]) errors.push(scene.id + " " + choice.id + " missing " + field);
          }
        }
      }
    }
    if (scene.kind === "dots") {
      const nodeIds = new Set(scene.nodes.map((node) => node.id));
      for (const link of scene.links) {
        if (!nodeIds.has(link.from) || !nodeIds.has(link.to)) errors.push("bad dots link");
      }
    }
  }
  return errors;
}
