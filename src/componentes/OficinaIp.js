import React, { useState } from 'react';

const OficinaIp = () => {
    const [ipAddress, setIpAddress] = useState('');
    const [subnetMask, setSubnetMask] = useState('');
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');

    const ipToInt = (ip) => {
        return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0);
    };

    const intToIp = (int) => {
        return [
            (int >>> 24) & 0xff,
            (int >>> 16) & 0xff,
            (int >>> 8) & 0xff,
            int & 0xff
        ].join('.');
    };

    const calculateNetwork = () => {
        setError('');
        try {
            const ipInt = ipToInt(ipAddress);
            const maskInt = ipToInt(subnetMask);

            const networkInt = ipInt & maskInt;
            const broadcastInt = networkInt | (~maskInt & 0xffffffff);

            const firstUsable = networkInt + 1;
            const lastUsable = broadcastInt - 1;
            const totalUsable = lastUsable - firstUsable + 1;

            const usableIps = [];
            for (let i = firstUsable; i <= lastUsable; i++) {
                usableIps.push(intToIp(i >>> 0));
            }

            setResults({
                network: intToIp(networkInt >>> 0),
                broadcast: intToIp(broadcastInt >>> 0),
                firstUsable: intToIp(firstUsable >>> 0),
                lastUsable: intToIp(lastUsable >>> 0),
                totalUsable,
                usableIps
            });
        } catch (err) {
            setError('IP ou máscara de rede inválidos');
        }
    };

    return (
        <div className="oficina-ip">
            <h1>Calculadora de Rede IPv4</h1>
            
            <div className="input-group">
                <input
                    type="text"
                    placeholder="Ex: 192.168.1.100"
                    value={ipAddress}
                    onChange={(e) => setIpAddress(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Ex: 255.255.255.0"
                    value={subnetMask}
                    onChange={(e) => setSubnetMask(e.target.value)}
                />
                <button onClick={calculateNetwork}>Calcular</button>
            </div>

            {error && <div className="error">{error}</div>}

            {results && (
                <div className="results">
                    <div className="info-box">
                        <p><strong>Endereço de Rede:</strong> {results.network}</p>
                        <p><strong>Endereço de Broadcast:</strong> {results.broadcast}</p>
                        <p><strong>Primeiro IP Utilizável:</strong> {results.firstUsable}</p>
                        <p><strong>Último IP Utilizável:</strong> {results.lastUsable}</p>
                        <p><strong>Total de IPs Utilizáveis:</strong> {results.totalUsable}</p>
                    </div>

                    <h2>IPs Disponíveis</h2>
                    <div className="table-container">
                        <table>
                            <tbody>
                                {Array.from({ length: Math.ceil(results.usableIps.length / 10) }).map((_, row) => (
                                    <tr key={row}>
                                        {Array.from({ length: 10 }).map((_, col) => {
                                            const index = row * 10 + col;
                                            return (
                                                <td key={col}>
                                                    {index < results.usableIps.length ? results.usableIps[index] : ''}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OficinaIp;