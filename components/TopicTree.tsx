import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { MqttMessage } from '../context/MqttContext';

interface TreeNode {
    name: string;
    fullPath: string;
    children: Record<string, TreeNode>;
    message?: MqttMessage;
    collapsed: boolean;
}

interface TopicTreeProps {
    messages: MqttMessage[];
}

const buildTree = (messages: MqttMessage[]): Record<string, TreeNode> => {
    const root: Record<string, TreeNode> = {};

    messages.forEach(msg => {
        const parts = msg.topic.split('/');
        let currentLevel = root;
        let currentPath = '';

        parts.forEach((part, index) => {
            currentPath = currentPath ? `${currentPath}/${part}` : part;

            if (!currentLevel[part]) {
                currentLevel[part] = {
                    name: part,
                    fullPath: currentPath,
                    children: {},
                    collapsed: true, // Default collapsed? maybe false for better visibility
                    // Actually, modifying 'collapsed' here in the build function implies it resets on every render.
                    // We need to separate state from data or be smart about it.
                    // For a simple implementation, we might lose expanded state on update if we rebuild from scratch.
                    // Better approach: pure data tree, separate expanded state in component.
                } as any;
            }

            if (index === parts.length - 1) {
                currentLevel[part].message = msg;
            }

            currentLevel = currentLevel[part].children;
        });
    });

    return root;
};

// Recursive Node Component
const NodeItem = ({
    node,
    level,
    expandedKeys,
    toggleExpand
}: {
    node: TreeNode,
    level: number,
    expandedKeys: Set<string>,
    toggleExpand: (path: string) => void
}) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark'; // Or logic if user inverted it, sticking to standard.

    // Check local expansion state
    const isExpanded = expandedKeys.has(node.fullPath);
    const hasChildren = Object.keys(node.children).length > 0;

    return (
        <View style={{ marginLeft: level * 10 }}>
            <View style={styles.nodeContainer}>
                <TouchableOpacity
                    onPress={() => toggleExpand(node.fullPath)}
                    style={styles.nodeLabel}
                    disabled={!hasChildren}
                >
                    <Text style={{ color: isDark ? '#fff' : '#000', fontWeight: 'bold' }}>
                        {hasChildren ? (isExpanded ? '▼ ' : '▶ ') : '• '}
                        {node.name}
                    </Text>
                </TouchableOpacity>

                {node.message && (
                    <Text style={[styles.payload, { color: isDark ? '#aaa' : '#555' }]} numberOfLines={1}>
                        : {node.message.payload}
                    </Text>
                )}
            </View>

            {isExpanded && hasChildren && (
                <View>
                    {Object.values(node.children).map((child) => (
                        <NodeItem
                            key={child.fullPath}
                            node={child}
                            level={level + 1}
                            expandedKeys={expandedKeys}
                            toggleExpand={toggleExpand}
                        />
                    ))}
                </View>
            )}
        </View>
    );
};

export default function TopicTree({ messages }: TopicTreeProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());

    // Memoize the tree construction. 
    // Note: If messages change frequently, this rebuilds often.
    // Ideally we merge updates, but for now strict rebuild is safer for correctness.
    const treeRoot = useMemo(() => buildTree(messages), [messages]);

    const toggleExpand = (path: string) => {
        setExpandedKeys(prev => {
            const next = new Set(prev);
            if (next.has(path)) {
                next.delete(path);
            } else {
                next.add(path);
            }
            return next;
        });
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
            {Object.values(treeRoot).map(node => (
                <NodeItem
                    key={node.fullPath}
                    node={node}
                    level={0}
                    expandedKeys={expandedKeys}
                    toggleExpand={toggleExpand}
                />
            ))}
            {messages.length === 0 && <Text style={{ padding: 10, color: '#888' }}>No data</Text>}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    nodeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
    },
    nodeLabel: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    payload: {
        fontSize: 12,
        marginLeft: 5,
        fontStyle: 'italic',
        flex: 1,
    }
});
