'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create Users table
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      full_name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      username: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: true
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      password_hash: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      role: {
        type: Sequelize.ENUM('Admin', 'Doctor', 'Patient'),
        allowNull: false,
        defaultValue: 'Doctor'
      },
      banned: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      specialization: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      resetPasswordToken: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      resetPasswordExpire: {
        type: Sequelize.DATE,
        allowNull: true
      },
      loginAttempts: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      lockUntil: {
        type: Sequelize.DATE,
        allowNull: true
      },
      refreshToken: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      verificationToken: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      verificationExpire: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add indexes
    await queryInterface.addIndex('Users', ['role']);
    await queryInterface.addIndex('Users', ['banned']);
    await queryInterface.addIndex('Users', ['resetPasswordToken']);
    await queryInterface.addIndex('Users', ['verificationToken']);
    await queryInterface.addIndex('Users', ['isVerified']);
    await queryInterface.addIndex('Users', ['email']);
    await queryInterface.addIndex('Users', ['username']);

    // Create Appointments table
    await queryInterface.createTable('Appointments', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      patient_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      doctor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      department: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      appointment_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      appointment_time: {
        type: Sequelize.TIME,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('Pending', 'Confirmed', 'Cancelled', 'Completed'),
        allowNull: false,
        defaultValue: 'Pending'
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add unique constraint to prevent double-booking
    await queryInterface.addIndex('Appointments', ['doctor_id', 'appointment_date', 'appointment_time'], {
      unique: true,
      name: 'unique_doctor_appointment'
    });
    await queryInterface.addIndex('Appointments', ['patient_id']);
    await queryInterface.addIndex('Appointments', ['status']);

    // Create MedicalRecords table
    await queryInterface.createTable('MedicalRecords', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      patient_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      doctor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      appointment_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Appointments',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      diagnosis: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      prescriptions: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      allergies: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      lab_results: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addIndex('MedicalRecords', ['patient_id']);
    await queryInterface.addIndex('MedicalRecords', ['doctor_id']);

    // Create Messages table
    await queryInterface.createTable('Messages', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      sender_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      receiver_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('unread', 'read'),
        allowNull: false,
        defaultValue: 'unread'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addIndex('Messages', ['sender_id']);
    await queryInterface.addIndex('Messages', ['receiver_id']);
    await queryInterface.addIndex('Messages', ['status']);

    // Create Payments table
    await queryInterface.createTable('Payments', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      patient_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      patient_name: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('Paid', 'Pending'),
        allowNull: false,
        defaultValue: 'Pending'
      },
      screenshot: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addIndex('Payments', ['patient_id']);
    await queryInterface.addIndex('Payments', ['status']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Payments');
    await queryInterface.dropTable('Messages');
    await queryInterface.dropTable('MedicalRecords');
    await queryInterface.dropTable('Appointments');
    await queryInterface.dropTable('Users');
  }
};
